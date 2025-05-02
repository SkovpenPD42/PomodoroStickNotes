from flask import Blueprint, jsonify
import time

# Ініціалізація Blueprint
timer_bp = Blueprint('timer', __name__)

# Глобальні змінні для таймера
TIMER_PHASES = ["focus", "break"]  # Фази: фокусування (25 хв) -> перерва (5 хв)
PHASE_DURATIONS = {"focus": 25 * 60, "break": 5 * 60}  # Тривалість у секундах
current_phase = 0
start_time = None

@timer_bp.route('/api/timer/', methods=['GET'])
def get_timer():
    """Повертає поточну фазу таймера."""
    global start_time, current_phase
    if start_time:
        elapsed = time.time() - start_time
        if elapsed >= PHASE_DURATIONS[TIMER_PHASES[current_phase]]:
            current_phase = (current_phase + 1) % len(TIMER_PHASES)
            start_time = time.time()
    return jsonify({"phase": TIMER_PHASES[current_phase]})

@timer_bp.route('/api/timer/start', methods=['POST'])
def start_timer():
    """Запускає таймер."""
    global start_time
    start_time = time.time()
    return jsonify({"message": "Таймер запущено"})

@timer_bp.route('/api/timer/reset', methods=['POST'])
def reset_timer():
    """Скидає таймер до початкового стану."""
    global start_time, current_phase
    start_time = None
    current_phase = 0
    return jsonify({"message": "Таймер скинуто"})
