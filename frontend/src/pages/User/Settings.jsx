import React, { useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUpload } from "react-icons/lu";
import toast from "react-hot-toast";

const Settings = () => {
  const { user, updateUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profileImageUrl: user?.profileImageUrl || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsLoading(true);
      setError(null);
      console.log("Отправка запроса на загрузку изображения...");
      const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("Ответ сервера:", response.data);
      
      if (response.data.imageUrl) {
        setFormData((prev) => ({
          ...prev,
          profileImageUrl: response.data.imageUrl,
        }));
        
        // Обновляем профиль пользователя сразу после загрузки изображения
        const updateResponse = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
          profileImageUrl: response.data.imageUrl,
        });
        
        if (updateResponse.data) {
          updateUser(updateResponse.data);
          toast.success("Изображение успешно загружено и обновлено в профиле");
        }
      } else {
        console.error("Неверный формат ответа:", response.data);
        toast.error("Ошибка при загрузке изображения: неверный формат ответа");
      }
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
      if (error.response) {
        console.error("Данные ответа:", error.response.data);
        toast.error(error.response.data.message || "Ошибка при загрузке изображения");
      } else {
        toast.error("Ошибка при загрузке изображения. Пожалуйста, попробуйте снова.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Проверка паролей
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("Новые пароли не совпадают");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        profileImageUrl: formData.profileImageUrl,
      });

      if (response.data) {
        updateUser(response.data);
        toast.success("Профиль успешно обновлен");
        
        // Очистка полей пароля
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Ошибка при обновлении профиля");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Настройки">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-medium mb-6">Настройки профиля</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Аватар */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={formData.profileImageUrl || "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <label
                htmlFor="image-upload"
                className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer hover:bg-primary/90"
              >
                <LuUpload className="text-lg" />
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="font-medium">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Основная информация */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Изменение пароля */}
          <div className="space-y-4">
            <h3 className="font-medium">Изменить пароль</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Текущий пароль
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Новый пароль
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подтвердите новый пароль
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Сообщения об ошибках и успехе */}
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          {success && (
            <div className="text-green-500 text-sm">{success}</div>
          )}

          {/* Кнопка сохранения */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Settings; 