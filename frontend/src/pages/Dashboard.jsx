import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "./MusicPlayer";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 20 * 60;
const COLORS = ["#facc15", "#f97316", "#22c55e", "#3b82f6", "#eb607e"];
const QUOTES = [
  "Код — це поезія, написана для машин, прочитана людьми.",
  "Тестуй, або сам станеш багом!",
  "Слава тим, хто дебажив без кави!",
  "У кожному багу живе нова фіча.",
  "Виправлення коду — як магія, тільки без чарівної палички.",
  "Чим більше ти кодуєш — тим менше ти боїшся помилок.",
  "Push — pray — profit.",
  "Стартуєш Pomodoro — стартуєш перемогу."
];

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("work");
  const [progress, setProgress] = useState(283);
  const [quote, setQuote] = useState("");
  const [sessionCount, setSessionCount] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);

  const getPhaseDuration = () => {
    switch (phase) {
      case "work": return WORK_TIME;
      case "break": return BREAK_TIME;
      case "longBreak": return LONG_BREAK_TIME;
      default: return WORK_TIME;
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);

          if (phase === "work") {
            const newSessionCount = sessionCount + 1;
            setSessionCount(newSessionCount);
            setFocusTime((prev) => prev + WORK_TIME);
            const nextPhase = newSessionCount % 4 === 0 ? "longBreak" : "break";
            setPhase(nextPhase);
            const nextDuration = nextPhase === "longBreak" ? LONG_BREAK_TIME : BREAK_TIME;
            setTimeLeft(nextDuration);
            showNotification(nextPhase === "longBreak" ? "Час на довгу перерву!" : "Час для перерви!");
          } else {
            setBreakTime((prev) => prev + getPhaseDuration());
            setPhase("work");
            setTimeLeft(WORK_TIME);
            showNotification("Час повернутися до роботи!");
          }

          setProgress(283);
          return getPhaseDuration();
        }

        setProgress((prevProgress) => Math.max(prevProgress - 283 / getPhaseDuration(), 0));
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, phase, sessionCount]);

  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      new Notification(message);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(message);
        }
      });
    }
  };

  const handleStart = () => {
    const random = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[random]);
    setIsRunning(true);
  };

  const startLongBreak = () => {
    setPhase("longBreak");
    setTimeLeft(LONG_BREAK_TIME);
    setProgress(283);
    setIsRunning(true);
  };

  const borderColor = phase === "break" ? "blue" : phase === "longBreak" ? "#38bdf8" : "yellow";
  const icon = phase === "break" ? "😴" : phase === "longBreak" ? "😇" : "🚀";

  const data = {
    labels: ["Фокус", "Перерви"],
    datasets: [
      {
        label: "Хвилини",
        data: [Math.floor(focusTime / 60), Math.floor(breakTime / 60)],
        backgroundColor: ["#22c55e", "#3b82f6"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Статистика за день" },
    },
  };

  return (
    <div className="flex flex-col items-center mb-10 relative z-10">
      <div className="relative w-56 h-56 flex items-center justify-center rounded-full bg-gray-800 shadow-lg border-4" style={{ borderColor }}>
        <span className={`text-7xl ${phase === "work" ? "shake" : ""}`}>{icon}</span>
        <svg className="absolute w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke={borderColor} strokeWidth="5" strokeDasharray="283" strokeDashoffset={progress} />
        </svg>
      </div>
      <p className="text-4xl font-bold mt-4">
        {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
      </p>
      <p className="mt-2 italic text-sm text-center max-w-xs">{quote}</p>
      <p className="mt-1 text-sm">Пройдено сесій: {sessionCount}</p>
      <div className="mt-4 space-x-2">
        <button className="bg-green-500 px-4 py-2 rounded text-white" onClick={handleStart}>Старт</button>
        <button className="bg-red-500 px-4 py-2 rounded text-white" onClick={() => { setIsRunning(false); setTimeLeft(WORK_TIME); setPhase("work"); setProgress(283); setQuote(""); }}>Стоп</button>
        <button className="bg-blue-500 px-4 py-2 rounded text-white" onClick={startLongBreak}>Довга перерва</button>
      </div>
      <div className="w-full max-w-md mt-6">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [checked, setChecked] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:5000/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((error) => console.error("Помилка при завантаженні нотаток:", error));
  }, []);

  const addNote = () => {
    if (!newNote.trim()) return;
    fetch("http://127.0.0.1:5000/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newNote }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNotes([...notes, data]);
        setNewNote("");
      })
      .catch((error) => console.error("Помилка при додаванні нотатки:", error));
  };

  const deleteNote = (id) => {
    fetch(`http://127.0.0.1:5000/notes/${id}`, { method: "DELETE" })
      .then(() => setNotes(notes.filter((note) => note.id !== id)))
      .catch((error) => console.error("Помилка при видаленні нотатки:", error));
  };

  const toggleCheck = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-1">Stick-Notes</h2>
      <div className="flex space-x-2 mb-4">
        <input className="w-full p-2 rounded text-black" type="text" placeholder="Введіть нотатку..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
        <button className="bg-blue-500 px-4 py-2 rounded text-white" onClick={addNote}>Додати</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {notes.map((note, index) => (
          <div key={note.id} className="p-3 rounded-lg text-black uppercase break-words flex justify-between items-center w-full min-h-[50px] px-4 py-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={checked[note.id] || false} onChange={() => toggleCheck(note.id)} />
              <p className="flex-1 font-bold uppercase">{note.text}</p>
            </div>
            <button className="ml-2 px-2 py-1 text-white bg-red-500 rounded" onClick={() => deleteNote(note.id)}>❌</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light") setIsDarkTheme(false);
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={`flex flex-col items-center text-white p-4 relative min-h-screen transition-all duration-500 ${isDarkTheme ? "bg-gradient-to-br from-blue-900 to-gray-900" : "bg-gradient-to-br from-yellow-300 to-orange-400 text-white"}`}>
      <div className="top-4 right-4 flex space-x-2">
        <button className="bg-blue-500 px-4 py-2 rounded text-white" onClick={handleLogout}>Вийти</button>
        <button className={`px-4 py-2 rounded ${isDarkTheme ? "bg-yellow-300 text-black" : "bg-gray-800 text-white"}`} onClick={toggleTheme}>
          {isDarkTheme ? "🌗🌞тема" : "🌗🌚тема"}
        </button>
      </div>
      <PomodoroTimer />
      <MusicPlayer />
      <Notes />
    </div>
  );
};

export default Dashboard;
