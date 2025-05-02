from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from database.models import db, User

auth_bp = Blueprint("auth", __name__)

SECRET_KEY = "3fe0fe102961d2f1184470406b6fe51f7d7b97e8e21ae315f23923d82a09e539"  


# Декоратор для перевірки JWT-токена
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("x-access-token")
        if not token:
            return jsonify({"message": "Токен відсутній!"}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data["user_id"]).first()
        except:
            return jsonify({"message": "Невірний токен!"}), 401
        return f(current_user, *args, **kwargs)
    return decorated


# Реєстрація користувача
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Введіть ім'я користувача та пароль!"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"message": "Користувач з таким ім'ям вже існує!"}), 400

    hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Користувач зареєстрований успішно!"})


# Вхід користувача
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Невірне ім'я користувача або пароль!"}), 401

    token = jwt.encode(
        {"user_id": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
        SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({"token": token})


# Отримати інформацію про поточного користувача
@auth_bp.route("/user", methods=["GET"])
@token_required
def get_user(current_user):
    return jsonify({"id": current_user.id, "username": current_user.username})
