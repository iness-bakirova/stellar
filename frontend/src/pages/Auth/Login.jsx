import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Form submission started");

    if (!validateEmail(email)) {
      setError("Пожалуйста, введите корректный адрес электронной почты.");
      return;
    }

    if (!password) {
      setError("Пожалуйста, введите пароль");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      console.log("Sending login request");
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        updateUser(response.data);

        if (response.data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        setError("Неверный ответ от сервера");
      }
    } catch (error) {
      console.error("Login error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "Invalid email or password") {
          setError("Неверный email или пароль");
        } else if (errorMessage === "User not found") {
          setError("Пользователь не найден");
        } else if (errorMessage === "Invalid credentials") {
          setError("Неверные учетные данные");
        } else if (errorMessage === "Email is required") {
          setError("Email обязателен");
        } else if (errorMessage === "Password is required") {
          setError("Пароль обязателен");
        } else {
          setError(errorMessage);
        }
      } else if (error.response?.status === 401) {
        setError("Неверный email или пароль");
      } else {
        setError("Что-то пошло не так. Пожалуйста, попробуйте снова.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Добро пожаловать обратно</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Пожалуйста, введите свои данные для входа
        </p>

        <form onSubmit={handleLogin} noValidate>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Электронная почта"
            placeholder="ivan@example.com"
            type="text"
          />

          <div className="relative">
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Пароль"
              placeholder="Минимум 8 символов"
              type="password"
            />
            <Link 
              to="/forgot-password" 
              className="absolute right-0 top-0 text-xs text-primary hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Вход..." : "ВОЙТИ"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Нет аккаунта?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              Зарегистрироваться
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
