from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import datetime

Base = declarative_base()

class UserRole(enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    STAFF = "staff"
    MAINTENANCE = "maintenance"

class RoomStatus(enum.Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    MAINTENANCE = "maintenance"
    DISABLED = "disabled"

class MaintenanceStatus(enum.Enum):
    REPORTED = "reported"
    IN_PROGRESS = "in_progress"
    WAITING_FOR_PARTS = "waiting_for_parts"
    COMPLETED = "completed"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.STAFF)
    is_active = Column(Boolean, default=True)

class RoomType(Base):
    __tablename__ = "room_types"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)  # Single, Suite
    size_sqm = Column(Float)
    base_price = Column(Float)
    description = Column(Text)

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, unique=True, index=True)
    room_type_id = Column(Integer, ForeignKey("room_types.id"))
    status = Column(Enum(RoomStatus), default=RoomStatus.AVAILABLE)
    last_inspection_date = Column(DateTime)
    next_inspection_date = Column(DateTime)
    
    room_type = relationship("RoomType")
    maintenance_requests = relationship("MaintenanceRequest", back_populates="room")

class Tenant(Base):
    __tablename__ = "tenants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    company = Column(String)
    phone = Column(String)
    email = Column(String)
    is_active = Column(Boolean, default=True)

class Contract(Base):
    __tablename__ = "contracts"
    id = Column(Integer, primary_key=True, index=True)
    contract_number = Column(String, unique=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    monthly_rent = Column(Float)
    status = Column(String)  # active, expired, terminated
    
    tenant = relationship("Tenant")
    room = relationship("Room")

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    reported_by_id = Column(Integer, ForeignKey("users.id"), nullable=True) # If staff logs it
    
    # Chinese Tenant Portal specific fields
    is_from_qr_portal = Column(Boolean, default=False)
    original_chinese_description = Column(Text)
    translated_thai_description = Column(Text)
    
    category = Column(String) # AC, Electrical, Plumbing, etc.
    description = Column(Text)
    status = Column(Enum(MaintenanceStatus), default=MaintenanceStatus.REPORTED)
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    cost = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    room = relationship("Room", back_populates="maintenance_requests")
    reported_by = relationship("User", foreign_keys=[reported_by_id])
    assigned_to = relationship("User", foreign_keys=[assigned_to_id])
    attachments = relationship("Attachment", back_populates="request")

class Attachment(Base):
    __tablename__ = "attachments"
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("maintenance_requests.id"))
    file_path = Column(String)
    file_type = Column(String) # image, pdf
    upload_date = Column(DateTime, default=datetime.utcnow)
    
    request = relationship("MaintenanceRequest", back_populates="attachments")
