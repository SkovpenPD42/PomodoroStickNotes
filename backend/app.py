from flask import Flask
from flask_cors import CORS
from database.models import db  # Імпортуємо базу даних
from routes.notes import notes_bp
from routes.timer import timer_bp
from routes.auth import auth_bp

app = Flask(__name__)

# Налаштування бази даних
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Ініціалізуємо базу
db.init_app(app)

# Включаємо CORS для всіх маршрутів
#CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
CORS(app, resources={r"/notes/*": {"origins": "*"}})

# Підключення маршрутів
app.register_blueprint(notes_bp, url_prefix='/notes')
app.register_blueprint(timer_bp, url_prefix='/timer')

# Створення таблиць
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    
app.register_blueprint(auth_bp, url_prefix="/auth") 

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})