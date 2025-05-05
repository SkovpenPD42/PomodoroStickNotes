**Pomodoro Focus Board**

Pomodoro Focus Board — це веб-застосунок, створений для підвищення продуктивності програмістів шляхом впровадження Pomodoro-методу, нотаток та аналітики часу.

**Основний функціонал**

- Pomodoro-таймер з автоматичною довгою перервою після 4 сесій
- Відображення кількості завершених сесій
- Можливість додати довільну нотатку
- Графік статистики дня (фокус / перерви)
- Вбудований музичний плеєр
- Повідомлення через нативні browser notifications
- 
Нотатки зберігаються через бекенд на Node.js/Express

Підтримується додавання, видалення, редагування

Для збереження інформації використовуються JSON-файли (або можна додати MongoDB)

**Технології**
Frontend: React, Vite, TailwindCSS, Chart.js

Backend: Node.js, Express

Зберігання нотаток: JSON / Local file (або база даних)

**Примітки**
Дозвольте сповіщення у браузері для повної функціональності Pomodoro

Не забудьте змінити CORS налаштування при деплої

**Інструкція запуску**

Крок 1. Клонування репозиторію

```bash
git clone https://github.com/SkovpenPD42/PomodoroStickNotes.git
cd PomodoroStickNotes

cd frontend
npm install
npm install react-chartjs-2 chart.js
npm run dev

cd ../backend
npm install
npm start




