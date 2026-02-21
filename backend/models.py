from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

class LostItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    color = db.Column(db.String(50))
    brand = db.Column(db.String(50))
    serial = db.Column(db.String(50))
    date_lost = db.Column(db.Date, nullable=False)
    time_lost = db.Column(db.Time)
    location = db.Column(db.String(200), nullable=False)
    landmark = db.Column(db.String(200))
    owner_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    images = db.Column(db.Text) # Storing as JSON string
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='lost')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "name": self.name,
            "description": self.description,
            "color": self.color,
            "brand": self.brand,
            "serial": self.serial,
            "date_lost": str(self.date_lost),
            "time_lost": str(self.time_lost) if self.time_lost else None,
            "location": self.location,
            "landmark": self.landmark,
            "owner_name": self.owner_name,
            "email": self.email,
            "phone": self.phone,
            "images": self.images,
            "user_id": self.user_id,
            "status": self.status,
            "created_at": self.created_at
        }

class FoundItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    color = db.Column(db.String(50))
    date_found = db.Column(db.Date, nullable=False)
    location_found = db.Column(db.String(200), nullable=False)
    custody = db.Column(db.String(50))
    finder_name = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(120), nullable=False)
    consent = db.Column(db.Boolean, default=False)
    images = db.Column(db.Text) # Storing as JSON string
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='found')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "description": self.description,
            "color": self.color,
            "date_found": str(self.date_found),
            "location_found": self.location_found,
            "custody": self.custody,
            "finder_name": self.finder_name,
            "contact": self.contact,
            "consent": self.consent,
            "images": self.images,
            "status": self.status,
            "created_at": self.created_at
        }

class CCTVRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(200), nullable=False)
    date_request = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(20), default='pending') # pending, approved, rejected
    footage_url = db.Column(db.String(500))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "location": self.location,
            "date_request": str(self.date_request),
            "start_time": str(self.start_time),
            "end_time": str(self.end_time),
            "status": self.status,
            "footage_url": self.footage_url,
            "created_at": self.created_at
        }
