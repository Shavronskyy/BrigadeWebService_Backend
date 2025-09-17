import React, { useState, useEffect } from "react";
import "./AdminDonations.css";
import {
  donationsApiService,
  DonationCreateModel,
  Donation,
} from "../services/donationsApi";

interface DonationFormData {
  title: string;
  description: string;
  goal: string;
  donationLink: string;
  img: string;
}

const AdminDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    donationId: number | null;
    donationTitle: string;
  }>({
    isOpen: false,
    donationId: null,
    donationTitle: "",
  });
  const [formData, setFormData] = useState<DonationFormData>({
    title: "",
    description: "",
    goal: "",
    donationLink: "",
    img: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await donationsApiService.getAllDonations();
        setDonations(data);
      } catch (error) {
        console.error("Failed to fetch donations:", error);
        setError("Помилка завантаження зборів");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const openModal = (donation?: Donation) => {
    if (donation) {
      setEditingDonation(donation);
      setFormData({
        title: donation.title,
        description: donation.description,
        goal: donation.goal.toString(),
        donationLink: donation.donationLink,
        img: donation.img,
      });
    } else {
      setEditingDonation(null);
      setFormData({
        title: "",
        description: "",
        goal: "",
        donationLink: "",
        img: "",
      });
    }
    setSelectedImage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDonation(null);
    setFormData({
      title: "",
      description: "",
      goal: "",
      donationLink: "",
      img: "",
    });
    setSelectedImage(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedImage(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const donationData: DonationCreateModel = {
        id: editingDonation?.id,
        title: formData.title,
        description: formData.description,
        goal: parseInt(formData.goal),
        creationDate: editingDonation?.creationDate || new Date().toISOString(),
        donationLink: formData.donationLink,
        img: formData.img,
        isCompleted: editingDonation?.isCompleted || false,
      };

      let result: Donation;

      if (editingDonation) {
        result = await donationsApiService.updateDonation(donationData);
        setDonations((prev) =>
          prev.map((d) => (d.id === editingDonation.id ? result : d))
        );
        showNotification("Збір успішно оновлено", "success");
      } else {
        result = await donationsApiService.createDonation(donationData);
        setDonations((prev) => [...prev, result]);
        showNotification("Збір успішно додано", "success");
      }

      // Upload image if selected
      if (selectedImage && result.id) {
        try {
          const uploadResult = await donationsApiService.uploadImage(
            result.id,
            selectedImage
          );
          // Update the donation with new image URL
          const updatedResult = { ...result, img: uploadResult.url };
          setDonations((prev) =>
            prev.map((d) => (d.id === result.id ? updatedResult : d))
          );
        } catch (uploadError) {
          console.error("Failed to upload image:", uploadError);
          showNotification(
            "Збір збережено, але зображення не завантажено",
            "error"
          );
        }
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save donation:", error);
      showNotification("Помилка збереження збору", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openDeleteConfirm = (id: number, title: string) => {
    setDeleteConfirm({
      isOpen: true,
      donationId: id,
      donationTitle: title,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      donationId: null,
      donationTitle: "",
    });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.donationId) {
      try {
        await donationsApiService.deleteDonation(deleteConfirm.donationId);
        setDonations((prev) =>
          prev.filter((d) => d.id !== deleteConfirm.donationId)
        );
        showNotification("Збір успішно видалено", "success");
        closeDeleteConfirm();
      } catch (error) {
        console.error("Failed to delete donation:", error);
        showNotification("Помилка видалення збору", "error");
      }
    }
  };

  const toggleDonationStatus = async (id: number) => {
    try {
      const donation = donations.find((d) => d.id === id);
      if (!donation) return;

      const updatedDonation: DonationCreateModel = {
        ...donation,
        isCompleted: !donation.isCompleted,
      };

      const result = await donationsApiService.updateDonation(updatedDonation);
      setDonations((prev) => prev.map((d) => (d.id === id ? result : d)));
      showNotification(
        result.isCompleted ? "Збір позначено як завершений" : "Збір активовано",
        "success"
      );
    } catch (error) {
      console.error("Failed to toggle donation status:", error);
      showNotification("Помилка зміни статусу збору", "error");
    }
  };

  const deleteImage = async (id: number) => {
    try {
      await donationsApiService.deleteImage(id);
      const updatedDonations = donations.map((d) =>
        d.id === id ? { ...d, img: "" } : d
      );
      setDonations(updatedDonations);
      showNotification("Зображення успішно видалено", "success");
    } catch (error) {
      console.error("Failed to delete image:", error);
      showNotification("Помилка видалення зображення", "error");
    }
  };

  return (
    <div className="admin-donations">
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
        <h2>Управління зборами</h2>
        <button className="add-btn" onClick={() => openModal()}>
          <span>+</span> Додати збір
        </button>
      </div>

      {loading ? (
        <div className="loading">Завантаження зборів...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="donations-table">
          <table>
            <thead>
              <tr>
                <th>Зображення</th>
                <th>Назва</th>
                <th>Мета</th>
                <th>Дата створення</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data">
                    Ви ще не додали жодного збору
                  </td>
                </tr>
              ) : (
                donations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="donation-image-cell">
                      {donation.img ? (
                        <div className="image-container">
                          <img src={donation.img} alt={donation.title} />
                          <button
                            className="delete-image-btn"
                            onClick={() => deleteImage(donation.id)}
                            title="Видалити зображення"
                          >
                            🗑️
                          </button>
                        </div>
                      ) : (
                        <div className="no-image">Немає зображення</div>
                      )}
                    </td>
                    <td className="donation-title-cell">{donation.title}</td>
                    <td>{donation.goal.toLocaleString()} ₴</td>
                    <td>
                      {new Date(donation.creationDate).toLocaleDateString(
                        "uk-UA"
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          donation.isCompleted ? "completed" : "active"
                        }`}
                      >
                        {donation.isCompleted ? "Завершено" : "Активний"}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="action-btn edit"
                        onClick={() => openModal(donation)}
                        title="Редагувати"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn toggle"
                        onClick={() => toggleDonationStatus(donation.id)}
                        title={
                          donation.isCompleted ? "Активувати" : "Завершити"
                        }
                      >
                        {donation.isCompleted ? "🔄" : "✅"}
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() =>
                          openDeleteConfirm(donation.id, donation.title)
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingDonation ? "Редагувати збір" : "Додати збір"}</h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="donation-form">
              <div className="form-group">
                <label htmlFor="title">Назва збору *</label>
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
                <label htmlFor="description">Опис збору *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="goal">Мета збору (₴) *</label>
                  <input
                    type="number"
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    placeholder="1000000"
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="donationLink">Посилання на збір</label>
                  <input
                    type="url"
                    id="donationLink"
                    name="donationLink"
                    value={formData.donationLink}
                    onChange={handleInputChange}
                    placeholder="https://example.com/donation"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image">Зображення</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {selectedImage && (
                  <div className="selected-image">
                    <p>Вибрано: {selectedImage.name}</p>
                  </div>
                )}
                {formData.img && !selectedImage && (
                  <div className="current-image">
                    <p>Поточне зображення:</p>
                    <img src={formData.img} alt="Current" />
                  </div>
                )}
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
                  {editingDonation ? "Оновити" : "Додати"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                Ви впевнені, що хочете видалити збір{" "}
                <strong>"{deleteConfirm.donationTitle}"</strong>?
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

export default AdminDonations;
