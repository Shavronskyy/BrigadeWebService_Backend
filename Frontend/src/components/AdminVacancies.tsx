import React, { useState, useEffect } from "react";
import "./AdminVacancies.css";
import {
  vacanciesApiService,
  VacancyCreateModel,
  Vacancy,
} from "../services/vacanciesApi";

interface VacancyFormData {
  title: string;
  description: string;
  contactPhone: string;
  requirements: string[];
  salary: string;
  employmentType: string;
  educationLevel: string;
}

const AdminVacancies: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    vacancyId: number | null;
    vacancyTitle: string;
  }>({
    isOpen: false,
    vacancyId: null,
    vacancyTitle: "",
  });
  const [formData, setFormData] = useState<VacancyFormData>({
    title: "",
    description: "",
    contactPhone: "",
    requirements: [""],
    salary: "",
    employmentType: "",
    educationLevel: "",
  });

  // Fetch vacancies from API
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await vacanciesApiService.getAllVacancies();
        setVacancies(data);
      } catch (error) {
        console.error("Failed to fetch vacancies:", error);
        setError("Помилка завантаження вакансій");
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  const openModal = (vacancy?: Vacancy) => {
    if (vacancy) {
      setEditingVacancy(vacancy);
      setFormData({
        title: vacancy.title,
        description: vacancy.description,
        contactPhone: vacancy.contactPhone,
        requirements: [...(vacancy.requirements || [])],
        salary: vacancy.salary,
        employmentType: vacancy.employmentType,
        educationLevel: vacancy.educationLevel,
      });
    } else {
      setEditingVacancy(null);
      setFormData({
        title: "",
        description: "",
        contactPhone: "",
        requirements: [""],
        salary: "",
        employmentType: "",
        educationLevel: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVacancy(null);
    setFormData({
      title: "",
      description: "",
      contactPhone: "",
      requirements: [""],
      salary: "",
      employmentType: "",
      educationLevel: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData((prev) => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({ ...prev, requirements: newRequirements }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredRequirements = formData.requirements.filter(
      (req) => req.trim() !== ""
    );

    try {
      if (editingVacancy) {
        // Update existing vacancy
        const updatedVacancy: VacancyCreateModel = {
          id: editingVacancy.id,
          ...formData,
          requirements: filteredRequirements,
          postedDate: editingVacancy.postedDate,
        };
        const result = await vacanciesApiService.updateVacancy(updatedVacancy);
        setVacancies((prev) =>
          prev.map((v) => (v.id === editingVacancy.id ? result : v))
        );
        showNotification("Вакансію успішно оновлено", "success");
      } else {
        // Create new vacancy
        const newVacancy: VacancyCreateModel = {
          ...formData,
          requirements: filteredRequirements,
          postedDate: new Date().toISOString(),
        };
        const result = await vacanciesApiService.createVacancy(newVacancy);
        setVacancies((prev) => [...prev, result]);
        showNotification("Вакансію успішно додано", "success");
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save vacancy:", error);
      showNotification("Помилка збереження вакансії", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 seconds
  };

  const openDeleteConfirm = (id: number, title: string) => {
    setDeleteConfirm({
      isOpen: true,
      vacancyId: id,
      vacancyTitle: title,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      vacancyId: null,
      vacancyTitle: "",
    });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.vacancyId) {
      try {
        await vacanciesApiService.deleteVacancy(deleteConfirm.vacancyId);
        setVacancies((prev) =>
          prev.filter((v) => v.id !== deleteConfirm.vacancyId)
        );
        showNotification("Вакансію успішно видалено", "success");
        closeDeleteConfirm();
      } catch (error) {
        console.error("Failed to delete vacancy:", error);
        showNotification("Помилка видалення вакансії", "error");
      }
    }
  };

  return (
    <div className="admin-vacancies">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-message">{notification.message}</span>
          <button
            className="notification-close"
            onClick={() => setNotification(null)}
            title="Закрити"
          >
            ×
          </button>
        </div>
      )}

      <div className="section-header">
        <h2>Управління вакансіями</h2>
        <button className="add-btn" onClick={() => openModal()}>
          <span>+</span> Додати вакансію
        </button>
      </div>

      {loading ? (
        <div className="loading">Завантаження вакансій...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="vacancies-table">
          <table>
            <thead>
              <tr>
                <th>Назва</th>
                <th>Тип зайнятості</th>
                <th>Зарплата</th>
                <th>Освіта</th>
                <th>Дата публікації</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {vacancies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data">
                    Ви ще не додали жодної вакансії
                  </td>
                </tr>
              ) : (
                vacancies.map((vacancy) => (
                  <tr key={vacancy.id}>
                    <td>{vacancy.title}</td>
                    <td>{vacancy.employmentType}</td>
                    <td>{vacancy.salary}</td>
                    <td>{vacancy.educationLevel}</td>
                    <td>
                      {new Date(vacancy.postedDate).toLocaleDateString("uk-UA")}
                    </td>
                    <td className="actions">
                      <button
                        className="action-btn edit"
                        onClick={() => openModal(vacancy)}
                        title="Редагувати"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() =>
                          openDeleteConfirm(vacancy.id, vacancy.title)
                        }
                        title="Видалити"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {editingVacancy ? "Редагувати вакансію" : "Додати вакансію"}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="vacancy-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Назва вакансії *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="employmentType">Тип зайнятості *</label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Виберіть тип</option>
                    <option value="Контрактна служба">Контрактна служба</option>
                    <option value="Мобілізація">Мобілізація</option>
                    <option value="Добровольча служба">
                      Добровольча служба
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="salary">Зарплата *</label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="Наприклад: 15000 грн"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="educationLevel">Рівень освіти *</label>
                  <select
                    id="educationLevel"
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Виберіть рівень</option>
                    <option value="Середня">Середня</option>
                    <option value="Середня спеціальна">
                      Середня спеціальна
                    </option>
                    <option value="Вища">Вища</option>
                    <option value="Вища військова">Вища військова</option>
                    <option value="Вища медична">Вища медична</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contactPhone">Контактний телефон *</label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+380XXXXXXXXX"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Опис вакансії *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label>Вимоги до кандидата</label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="requirement-row">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) =>
                        handleRequirementChange(index, e.target.value)
                      }
                      placeholder="Введіть вимогу"
                    />
                    <button
                      type="button"
                      className="remove-req-btn"
                      onClick={() => removeRequirement(index)}
                      disabled={formData.requirements.length === 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-req-btn"
                  onClick={addRequirement}
                >
                  + Додати вимогу
                </button>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Скасувати
                </button>
                <button type="submit" className="save-btn">
                  {editingVacancy ? "Оновити" : "Додати"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="modal-overlay" onClick={closeDeleteConfirm}>
          <div
            className="delete-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-confirm-header">
              <div className="delete-icon">🗑️</div>
              <h3>Підтвердження видалення</h3>
            </div>
            <div className="delete-confirm-content">
              <p>
                Ви впевнені, що хочете видалити вакансію{" "}
                <strong>"{deleteConfirm.vacancyTitle}"</strong>?
              </p>
              <p className="delete-warning">Ця дія не може бути скасована.</p>
            </div>
            <div className="delete-confirm-actions">
              <button
                className="cancel-delete-btn"
                onClick={closeDeleteConfirm}
              >
                Скасувати
              </button>
              <button className="confirm-delete-btn" onClick={confirmDelete}>
                Видалити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVacancies;
