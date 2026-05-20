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

# --- Tenant Portal Endpoints ---

@app.post("/api/portal/report")
async def create_maintenance_report(
    room_number: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(database.get_db)
):
    # 1. Check if room exists (or create it for demo)
    room = db.query(models.Room).filter(models.Room.room_number == room_number).first()
    if not room:
        room = models.Room(room_number=room_number, status=models.RoomStatus.AVAILABLE)
        db.add(room)
        db.commit()
        db.refresh(room)

    # 2. Translate description
    translated_text = mock_translate_zh_to_th(description)

    # 3. Create maintenance request
    new_request = models.MaintenanceRequest(
        room_id=room.id,
        is_from_qr_portal=True,
        original_chinese_description=description,
        translated_thai_description=translated_text,
        category=category,
        description=translated_text, # Set primary description to Thai for Khun Aom
        status=models.MaintenanceStatus.REPORTED,
        created_at=datetime.utcnow()
    )
    
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    # 4. Handle photo (Save to uploads folder)
    if photo:
        file_location = f"../uploads/{new_request.id}_{photo.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(photo.file.read())
        
        attachment = models.Attachment(
            request_id=new_request.id,
            file_path=file_location,
            file_type="image"
        )
        db.add(attachment)
        db.commit()

    return {"status": "success", "id": new_request.id, "translated": translated_text}

# --- Admin Dashboard Endpoints ---

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
