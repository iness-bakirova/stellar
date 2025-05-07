import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import DeleteAlert from "../../components/DeleteAlert";
import Modal from "../../components/Modal";

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [openCancelAlert, setOpenCancelAlert] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
    setHasChanges(true);
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
    setHasChanges(false);
  };

  const handleCancel = () => {
    navigate('/admin/tasks');
  };

  const confirmCancel = () => {
    if (taskId) {
      getTaskDetailsByID();
    } else {
      clearData();
    }
    setOpenCancelAlert(false);
    setHasChanges(false);
  };

  const createTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      if (response.data) {
        // Сохраняем уведомление в локальное хранилище
        const notification = {
          id: Date.now(),
          taskId: response.data._id,
          title: taskData.title,
          message: `Задача "${taskData.title}" успешно создана`,
          createdAt: new Date().toISOString(),
          read: false,
          assignedTo: taskData.assignedTo
        };

        // Получаем существующие уведомления
        const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        
        // Добавляем новое уведомление
        const updatedNotifications = [...existingNotifications, notification];
        
        // Сохраняем обновленный список
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

        // Отправляем уведомление на сервер для назначенных пользователей
        if (taskData.assignedTo.length > 0) {
          try {
            await axiosInstance.post(API_PATHS.TASKS.CREATE_NOTIFICATION, {
              taskId: response.data._id,
              title: taskData.title,
              assignedTo: taskData.assignedTo,
              message: `Вам назначена новая задача: ${taskData.title}`
            });
          } catch (error) {
            console.error("Ошибка при отправке уведомления:", error);
          }
        }

        toast.success("Задача успешно создана");
        clearData();
        navigate('/admin/tasks');
      }
    } catch (error) {
      console.error("Ошибка при создании задачи:", error);
      toast.error(error.response?.data?.message || "Ошибка при создании задачи");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text == item);

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
          todoChecklist: todolist,
        }
      );

      if (response.data) {
        // Отправляем уведомления о назначении, если изменились назначенные пользователи
        const previousAssignedUsers = currentTask?.assignedTo?.map(user => user._id) || [];
        const newAssignedUsers = taskData.assignedTo || [];
        
        // Находим новых назначенных пользователей
        const newlyAssignedUsers = newAssignedUsers.filter(
          userId => !previousAssignedUsers.includes(userId)
        );

        if (newlyAssignedUsers.length > 0) {
          try {
            await axiosInstance.post(API_PATHS.TASKS.CREATE_NOTIFICATION, {
              taskId: taskId,
              title: taskData.title,
              assignedTo: newlyAssignedUsers,
              message: `Вам назначена новая задача: ${taskData.title}`
            });
          } catch (error) {
            console.error("Ошибка при отправке уведомления:", error);
          }
        }

        toast.success("Задача успешно обновлена");
        navigate('/admin/tasks');
      }
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      toast.error(error.response?.data?.message || "Ошибка при обновлении задачи");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!taskData.title.trim()) {
      setError("Требуется заголовок задачи.");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Требуется описание задачи.");
      return;
    }
    if (!taskData.dueDate) {
      setError("Необходимо указать срок выполнения.");
      return;
    }

    if (taskData.assignedTo?.length === 0) {
      setError("Задача не назначена ни одному участнику.");
      return;
    }

    if (taskData.todoChecklist?.length === 0) {
      setError("Добавьте хотя бы одну подзадачу.");
      return;
    }

    if (taskId) {
      updateTask();
      return;
    }

    createTask();
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        // Получаем ID назначенных пользователей
        const assignedUserIds = taskInfo.assignedTo?.map(user => user._id) || [];

        setTaskData((prevState) => ({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: assignedUserIds, // Используем массив ID пользователей
          todoChecklist:
            taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        }));

        console.log("Назначенные пользователи:", assignedUserIds); // Для отладки
      }
    } catch (error) {
      console.error("Ошибка при получении задачи:", error);
    }
  };

  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

      setOpenDeleteAlert(false);
      toast.success("Задача успешно удалена");
      navigate('/admin/tasks');
    } catch (error) {
      console.error(
        "Ошибка при удалении:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID(taskId);
    }

    return () => {};
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Создать задачу">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Редактировать задачу" : "Создать задачу"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Удалить
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Название задачи
              </label>

              <input
                placeholder="Создать интерфейс приложения"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Описание
              </label>

              <textarea
                placeholder="Опишите задачу"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Приоритет
                </label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Выберите приоритет"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Срок выполнения
                </label>

                <input
                  placeholder="Создать интерфейс"
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                  type="date"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Назначить
                </label>

                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => {
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Список дел
              </label>

              <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Прикрепить файлы
              </label>

              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end gap-3 mt-7">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={handleCancel}
              >
                ОТМЕНА
              </button>
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "ОБНОВИТЬ ЗАДАЧУ" : "СОЗДАТЬ ЗАДАЧУ"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Удалить задачу"
      >
        <DeleteAlert
          content="Вы уверены, что хотите удалить эту задачу?"
          onDelete={() => deleteTask()}
        />
      </Modal>

      <Modal
        isOpen={openCancelAlert}
        onClose={() => setOpenCancelAlert(false)}
        title="Отменить изменения"
      >
        <DeleteAlert
          content="Вы уверены, что хотите отменить изменения? Все несохраненные изменения будут потеряны."
          onDelete={() => confirmCancel()}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
