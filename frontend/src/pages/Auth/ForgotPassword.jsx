import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Пожалуйста, введите корректный адрес электронной почты.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
      setSuccess(true);
    } catch (error) {
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "User not found") {
          setError("Пользователь с таким email не найден");
        } else {
          setError(errorMessage);
        }
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
        <h3 className="text-xl font-semibold text-black">Восстановление пароля</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Введите ваш email для получения инструкций по восстановлению пароля
        </p>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 text-sm">
              Инструкции по восстановлению пароля отправлены на ваш email.
              Пожалуйста, проверьте вашу почту.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Электронная почта"
              placeholder="ivan@example.com"
              type="text"
            />

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Отправка..." : "ОТПРАВИТЬ"}
            </button>
          </form>
        )}

        <p className="text-[13px] text-slate-800 mt-3">
          Вспомнили пароль?{" "}
          <Link className="font-medium text-primary underline" to="/login">
            Войти
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword; 