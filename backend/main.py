from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models, database
from datetime import datetime

app = FastAPI(title="Bo Thong Residence API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
models.Base.metadata.create_all(bind=database.engine)

# Mock Translation Service (ZH -> TH)
# In production, we would use Google Translate API or similar
def mock_translate_zh_to_th(text: str) -> str:
    # A very basic mock for demo purposes
    translations = {
        "空调不冷": "แอร์ไม่เย็น",
        "漏水": "น้ำรั่ว",
        "厕所堵了": "ส้วมตัน",
        "灯坏了": "ไฟเสีย",
        "没有热水": "ไม่มีน้ำร้อน"
    }
    # Return translated text if found, else return a placeholder
    for key, val in translations.items():
        if key in text:
            return f"{val} (แปลจากจีน: {text})"
    return f"แจ้งซ่อม: {text} (รอการตรวจสอบ)"

@app.get("/")
def read_root():
    return {"message": "Welcome to Bo Thong Residence API"}

# --- Tenant & Handyman Portal Endpoints ---

@app.get("/api/portal/rooms/{room_number}/tickets")
async def get_room_tickets(room_number: str, db: Session = Depends(database.get_db)):
    room = db.query(models.Room).filter(models.Room.room_number == room_number).first()
    if not room:
        return []
    
    tickets = db.query(models.MaintenanceRequest).filter(
        models.MaintenanceRequest.room_id == room.id,
        models.MaintenanceRequest.status != models.MaintenanceStatus.COMPLETED
    ).all()
    
    result = []
    for t in tickets:
        result.append({
            "id": t.id,
            "category": t.category,
            "thai_description": t.translated_thai_description,
            "status": t.status.value,
            "created_at": t.created_at.strftime("%Y-%m-%d %H:%M")
        })
    return result

@app.post("/api/portal/report")
async def create_maintenance_report(
    room_number: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(database.get_db)
):
    translated_text = mock_translate_zh_to_th(description)
    room = db.query(models.Room).filter(models.Room.room_number == room_number).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
        
    new_request = models.MaintenanceRequest(
        room_id=room.id,
        is_from_qr_portal=True,
        original_chinese_description=description,
        translated_thai_description=translated_text,
        category=category,
        description=description,
        status=models.MaintenanceStatus.REPORTED
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    
    if photo:
        # Mock file saving
        pass
        
    return {"status": "success", "id": new_request.id, "translated": translated_text}

@app.post("/api/portal/resolve/{request_id}")
async def resolve_maintenance_report(
    request_id: int,
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(database.get_db)
):
    request = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Handyman marks as 'In Progress' or 'Waiting for Final Approval'
    # We'll use IN_PROGRESS for 'Fixed but waiting for Manager sign-off'
    request.status = models.MaintenanceStatus.IN_PROGRESS
    
    if photo:
        file_location = f"../uploads/fix_{request_id}_{photo.filename}"
        # (File writing logic omitted for brevity in mock, assume success)
        
    db.commit()
    return {"status": "success"}

# --- Admin Dashboard Endpoints ---

@app.get("/api/admin/rooms", response_model=List[dict])
def get_all_rooms(db: Session = Depends(database.get_db)):
    rooms = db.query(models.Room).order_by(models.Room.room_number).all()
    
    # Check for active maintenance requests per room to set virtual status
    active_maintenance = db.query(models.MaintenanceRequest).filter(
        models.MaintenanceRequest.status != models.MaintenanceStatus.COMPLETED
    ).all()
    repair_room_ids = {m.room_id for m in active_maintenance}

    result = []
    for r in rooms:
        # Determine status: prioritize Maintenance if there is an active request
        status = r.status.value
        if r.id in repair_room_ids:
            status = "maintenance"
            
        result.append({
            "id": r.id,
            "room_number": r.room_number,
            "status": status,
        })
    return result

@app.get("/api/admin/requests", response_model=List[dict])
def get_all_requests(db: Session = Depends(database.get_db)):
    requests = db.query(models.MaintenanceRequest).order_by(models.MaintenanceRequest.created_at.desc()).all()
    
    # Format for frontend
    result = []
    for r in requests:
        result.append({
            "id": r.id,
            "room_number": r.room.room_number,
            "category": r.category,
            "thai_description": r.translated_thai_description,
            "chinese_description": r.original_chinese_description,
            "status": r.status.value,
            "created_at": r.created_at.isoformat(),
            "is_portal": r.is_from_qr_portal
        })
    return result

@app.post("/api/admin/requests/{request_id}/done")
def mark_request_done(request_id: int, db: Session = Depends(database.get_db)):
    request = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    request.status = models.MaintenanceStatus.COMPLETED
    request.completed_at = datetime.utcnow()
    db.commit()
    return {"status": "success"}

@app.post("/api/admin/requests/{request_id}/reopen")
def reopen_request(request_id: int, db: Session = Depends(database.get_db)):
    request = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    request.status = models.MaintenanceStatus.REPORTED
    request.completed_at = None
    db.commit()
    return {"status": "success"}
