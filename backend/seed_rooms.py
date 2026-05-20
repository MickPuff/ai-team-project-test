import database, models
from sqlalchemy.orm import Session

def seed():
    db = next(database.get_db())
    
    # Define the room series based on the physical dashboard analysis
    series = {
        "1000": range(1001, 1033),
        "2000": range(2001, 2059),
        "3000": range(3001, 3044),
        "4000": range(4001, 4137),
        "5000": range(5001, 5081)
    }
    
    print("Seeding rooms...")
    count = 0
    for prefix, r_range in series.items():
        for num in r_range:
            room_num = str(num)
            # Check if exists
            exists = db.query(models.Room).filter(models.Room.room_number == room_num).first()
            if not exists:
                room = models.Room(room_number=room_num, status=models.RoomStatus.AVAILABLE)
                db.add(room)
                count += 1
    
    db.commit()
    print(f"Successfully seeded {count} new rooms.")

if __name__ == "__main__":
    seed()
