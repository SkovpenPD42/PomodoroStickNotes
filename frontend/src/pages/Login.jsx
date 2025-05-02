import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister
      ? "http://127.0.0.1:5000/auth/register"
      : "http://127.0.0.1:5000/auth/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (isRegister) {
          alert("Реєстрація успішна! Тепер увійдіть.");
          setIsRegister(false);
        } else if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/");
        } else {
          alert("Невірне ім’я користувача або пароль.");
        }
      } else {
        alert(data.message || "Помилка");
      }
    } catch (err) {
      console.error("Помилка:", err);
      alert("Помилка. Спробуйте пізніше.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 to-orange-400 text-black">
      <h1 className="text-3xl font-bold mb-6">
        {isRegister ? "Реєстрація" : "Вхід у Pomodoro & Notes"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <input
          type="text"
          placeholder="Ім’я користувача"
          className="w-full p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          {isRegister ? "Зареєструватися" : "Увійти"}
        </button>
        <p
          className="text-sm text-center text-blue-600 cursor-pointer"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Вже є обліковий запис? Увійти" : "Немає облікового запису? Зареєструватися"}
        </p>
      </form>
    </div>
  );
}

export default Login;
