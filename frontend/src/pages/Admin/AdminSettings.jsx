import React, { useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    systemName: "Stellar",
    maxFileSize: 5, // MB
    allowedFileTypes: ["jpg", "jpeg", "png"],
    enableNotifications: true,
    enableEmailNotifications: true,
    maintenanceMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement system settings update
      toast.success("Настройки системы обновлены");
    } catch (error) {
      console.error("Ошибка при обновлении настроек:", error);
      toast.error("Ошибка при обновлении настроек");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Настройки">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Настройки системы</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основные настройки */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Основные настройки</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Название системы
                </label>
                <input
                  type="text"
                  name="systemName"
                  value={formData.systemName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Максимальный размер файла (МБ)
                </label>
                <input
                  type="number"
                  name="maxFileSize"
                  value={formData.maxFileSize}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Настройки уведомлений */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Настройки уведомлений</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="enableNotifications"
                  checked={formData.enableNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Включить уведомления в системе
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="enableEmailNotifications"
                  checked={formData.enableEmailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Включить email-уведомления
                </label>
              </div>
            </div>
          </div>

          {/* Режим обслуживания */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Режим обслуживания</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={formData.maintenanceMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Включить режим обслуживания
                </label>
              </div>
              <p className="text-sm text-gray-500">
                В режиме обслуживания система будет недоступна для обычных пользователей
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isLoading ? "Сохранение..." : "Сохранить настройки"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings; 