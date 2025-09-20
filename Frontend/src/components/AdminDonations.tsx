import React, { useState, useEffect } from "react";
import "./AdminDonations.css";
import {
  donationsApiService,
  DonationCreateModel,
  Donation,
  ReportCreateModel,
} from "../services/donationsApi";

interface DonationFormData {
  title: string;
  description: string;
  goal: string;
  donationLink: string;
}

interface ReportFormData {
  title: string;
  description: string;
  category: string;
}

const AdminDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportsListModalOpen, setIsReportsListModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [reportDonation, setReportDonation] = useState<Donation | null>(null);
  const [editingReport, setEditingReport] = useState<any | null>(null);
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
  });
  const [reportFormData, setReportFormData] = useState<ReportFormData>({
    title: "",
    description: "",
    category: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedReportImage, setSelectedReportImage] = useState<File | null>(
    null
  );

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("AdminDonations: Starting to fetch donations...");
        const data = await donationsApiService.getAllDonations();
        console.log("AdminDonations: Successfully fetched donations:", data);

        // Fetch reports for each donation
        const donationsWithReports = await Promise.all(
          data.map(async (donation) => {
            try {
              console.log(`Fetching reports for donation ${donation.id}...`);
              const reports = await donationsApiService.getReportsByDonationId(
                donation.id
              );
              console.log(`Reports for donation ${donation.id}:`, reports);
              return {
                ...donation,
                reports: reports,
              };
            } catch (reportError) {
              console.error(
                `Failed to fetch reports for donation ${donation.id}:`,
                reportError
              );
              // Return donation without reports if fetching reports fails
              return {
                ...donation,
                reports: [],
              };
            }
          })
        );

        console.log(
          "AdminDonations: Donations with reports:",
          donationsWithReports
        );
        setDonations(donationsWithReports);
      } catch (error) {
        console.error("AdminDonations: Failed to fetch donations:", error);
        let errorMessage = "Помилка завантаження зборів";

        if (error instanceof Error) {
          if (error.message.includes("Unexpected end of JSON input")) {
            errorMessage =
              "Сервер повернув порожню відповідь. Можливо, дані ще не додані.";
          } else if (error.message.includes("Failed to fetch")) {
            errorMessage =
              "Не вдалося підключитися до сервера. Перевірте налаштування API.";
          } else if (error.message.includes("non-JSON response")) {
            errorMessage =
              "Сервер повернув некоректну відповідь. Перевірте налаштування API.";
          } else {
            errorMessage = error.message;
          }
        }

        setError(errorMessage);
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
      });
    } else {
      setEditingDonation(null);
      setFormData({
        title: "",
        description: "",
        goal: "",
        donationLink: "",
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
    });
    setSelectedImage(null);
  };

  const openReportModal = (donation: Donation, report?: any) => {
    setReportDonation(donation);
    if (report) {
      // Editing existing report
      setEditingReport(report);
      setReportFormData({
        title: report.title || "",
        description: report.description || "",
        category: report.category || "",
      });
    } else {
      // Adding new report
      setEditingReport(null);
      setReportFormData({
        title: "",
        description: "",
        category: "",
      });
    }
    setSelectedReportImage(null);
    setIsReportModalOpen(true);
  };

  const openReportsListModal = (donation: Donation) => {
    setReportDonation(donation);
    setIsReportsListModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setReportDonation(null);
    setEditingReport(null);
    setReportFormData({
      title: "",
      description: "",
      category: "",
    });
    setSelectedReportImage(null);
  };

  const closeReportsListModal = () => {
    setIsReportsListModalOpen(false);
    setReportDonation(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReportInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReportFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedImage(file || null);
  };

  const handleReportImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedReportImage(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate image upload for new donations
    if (!editingDonation && !selectedImage) {
      showNotification("Будь ласка, виберіть зображення для збору", "error");
      return;
    }

    try {
      // Get current date in Kyiv timezone
      const now = new Date();
      const kyivTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Europe/Kiev" })
      );
      const creationDate = kyivTime.toISOString();

      const donationData: DonationCreateModel = {
        id: editingDonation?.id,
        title: formData.title,
        description: formData.description,
        goal: parseInt(formData.goal),
        creationDate: editingDonation?.creationDate || creationDate,
        donationLink: formData.donationLink,
        img: editingDonation?.img || "", // Will be updated after image upload
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
          showNotification("Зображення успішно завантажено", "success");
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
      const errorMessage =
        error instanceof Error ? error.message : "Помилка збереження збору";
      showNotification(errorMessage, "error");
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportDonation) return;

    try {
      const reportData: ReportCreateModel = {
        title: reportFormData.title,
        description: reportFormData.description,
        category: reportFormData.category,
        img: "",
        donationId: reportDonation.id,
        createdAt: new Date().toISOString(),
      };

      if (editingReport) {
        // Update existing report
        console.log("Updating report:", editingReport.id);
        // TODO: Implement update report API call when backend endpoint is available
        showNotification("Оновлення звітів поки не реалізовано", "error");
      } else {
        // Create new report
        console.log("Creating report for donation ID:", reportDonation.id);
        const result = await donationsApiService.addReportToDonation(
          reportDonation.id,
          reportData
        );
        showNotification("Звіт успішно додано", "success");

        setDonations((prev) =>
          prev.map((d) => (d.id === result.id ? result : d))
        );
      }

      closeReportModal();
    } catch (error) {
      console.error("Failed to save report:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Помилка збереження звіту";
      showNotification(errorMessage, "error");
    }
  };

  const deleteReport = async (donationId: number) => {
    // TODO: Implement report deletion when backend endpoint is available
    showNotification("Видалення звітів поки не реалізовано", "error");
  };

  const deleteIndividualReport = async (
    donationId: number,
    reportId: number
  ) => {
    // TODO: Implement individual report deletion when backend endpoint is available
    showNotification("Видалення окремого звіту поки не реалізовано", "error");
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
        const errorMessage =
          error instanceof Error ? error.message : "Помилка видалення збору";
        showNotification(errorMessage, "error");
      }
    }
  };

  const toggleDonationStatus = async (id: number) => {
    try {
      const donation = donations.find((d) => d.id === id);
      if (!donation) return;

      await donationsApiService.toggleDonationStatus(id);

      // Update local state by toggling the isCompleted status
      setDonations((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, isCompleted: !d.isCompleted } : d
        )
      );

      showNotification(
        !donation.isCompleted
          ? "Збір позначено як завершений"
          : "Збір активовано",
        "success"
      );
    } catch (error) {
      console.error("Failed to toggle donation status:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Помилка зміни статусу збору";
      showNotification(errorMessage, "error");
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
        <div className="donations-list">
          {donations.length === 0 ? (
            <div className="no-donations">Ви ще не додали жодного збору</div>
          ) : (
            donations.map((donation) => {
              console.log(`Rendering donation ${donation.id}:`, donation);
              console.log(
                `Reports for donation ${donation.id}:`,
                donation.reports
              );
              return (
                <div key={donation.id} className="donation-item">
                  {donation.img ? (
                    <img
                      src={donation.img}
                      alt={donation.title}
                      className="donation-image"
                    />
                  ) : (
                    <div
                      className="donation-image"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "0.8rem",
                      }}
                    >
                      Немає фото
                    </div>
                  )}

                  <div className="donation-content">
                    <h3 className="donation-title">{donation.title}</h3>
                    <div className="donation-details">
                      <span className="donation-goal">
                        Мета: {donation.goal.toLocaleString()} ₴
                      </span>
                      <span className="donation-date">
                        {new Date(donation.creationDate).toLocaleDateString(
                          "uk-UA"
                        )}
                      </span>
                    </div>
                    <button
                      className="reports-button"
                      onClick={() => openReportsListModal(donation)}
                      title="Переглянути звіти"
                    >
                      📊 Звіти про використання коштів (
                      {donation.reports ? donation.reports.length : 0})
                    </button>
                  </div>

                  <div className="donation-status">
                    <span
                      className={`status-badge ${
                        donation.isCompleted ? "completed" : "active"
                      }`}
                    >
                      {donation.isCompleted ? "Завершено" : "Активний"}
                    </span>
                  </div>

                  <div className="donation-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => openModal(donation)}
                      title="Редагувати"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn report"
                      onClick={() => openReportModal(donation)}
                      title={
                        donation.reports && donation.reports.length > 0
                          ? "Додати ще звіт"
                          : "Додати звіт"
                      }
                    >
                      📊
                    </button>
                    {donation.reports && donation.reports.length > 0 && (
                      <button
                        className="action-btn delete-report"
                        onClick={() => deleteReport(donation.id)}
                        title="Видалити звіти"
                      >
                        🗑️
                      </button>
                    )}
                    <button
                      className="action-btn toggle"
                      onClick={() => toggleDonationStatus(donation.id)}
                      title={donation.isCompleted ? "Активувати" : "Завершити"}
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
                  </div>
                </div>
              );
            })
          )}
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

              <div className="form-group">
                <label htmlFor="image">
                  Зображення {!editingDonation && "*"}
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingDonation}
                />
                {selectedImage && (
                  <div className="selected-image">
                    <p>Вибрано: {selectedImage.name}</p>
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "150px",
                        marginTop: "10px",
                        borderRadius: "6px",
                      }}
                    />
                  </div>
                )}
                {editingDonation?.img && !selectedImage && (
                  <div className="current-image">
                    <p>Поточне зображення:</p>
                    <img src={editingDonation.img} alt="Current" />
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

      {isReportModalOpen && reportDonation && (
        <div className="modal-overlay" onClick={closeReportModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingReport ? "Редагувати звіт" : "Додати звіт"}</h3>
              <button className="modal-close" onClick={closeReportModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="donation-form">
              <div className="form-group">
                <label htmlFor="title">Назва звіту *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={reportFormData.title}
                  onChange={handleReportInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Повний опис звіту *</label>
                <textarea
                  id="description"
                  name="description"
                  value={reportFormData.description}
                  onChange={handleReportInputChange}
                  rows={6}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Категорія *</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={reportFormData.category}
                  onChange={handleReportInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reportImage">Зображення звіту</label>
                <input
                  type="file"
                  id="reportImage"
                  accept="image/*"
                  onChange={handleReportImageChange}
                />
                {selectedReportImage && (
                  <div className="selected-image">
                    <p>Вибрано: {selectedReportImage.name}</p>
                    <img
                      src={URL.createObjectURL(selectedReportImage)}
                      alt="Preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "150px",
                        marginTop: "10px",
                        borderRadius: "6px",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeReportModal}
                >
                  Скасувати
                </button>
                <button type="submit" className="save-btn">
                  {editingReport ? "Оновити звіт" : "Додати звіт"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reports List Modal */}
      {isReportsListModalOpen && reportDonation && (
        <div className="modal-overlay" onClick={closeReportsListModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Звіти про використання коштів: {reportDonation.title}</h3>
              <button className="modal-close" onClick={closeReportsListModal}>
                ×
              </button>
            </div>

            <div className="reports-list-container">
              {reportDonation.reports && reportDonation.reports.length > 0 ? (
                <div className="reports-list">
                  {reportDonation.reports.map((report: any, index: number) => (
                    <div key={index} className="report-item">
                      <div className="report-content">
                        <div className="report-header">
                          <div className="report-meta">
                            <p className="report-category">
                              Категорія: {report.category}
                            </p>
                            <p className="report-date">
                              Дата:{" "}
                              {new Date(report.createdAt).toLocaleDateString(
                                "uk-UA"
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="report-title-section">
                          <p className="report-title-label">Назва</p>
                          <h4>{report.title}</h4>
                        </div>

                        <div className="report-description-section">
                          <p className="report-description-label">Опис</p>
                          <p className="report-description">
                            {report.description}
                          </p>
                        </div>

                        {report.img && (
                          <div className="report-image">
                            <img
                              src={report.img}
                              alt={report.title}
                              style={{ maxWidth: "200px", maxHeight: "150px" }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="report-actions">
                        <button
                          className="action-btn edit"
                          onClick={() => {
                            closeReportsListModal();
                            openReportModal(reportDonation, report);
                          }}
                          title="Редагувати звіт"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() =>
                            deleteIndividualReport(reportDonation.id, report.id)
                          }
                          title="Видалити звіт"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-reports">
                  <p>Поки що немає звітів для цього збору.</p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="add-report-btn"
                onClick={() => {
                  closeReportsListModal();
                  openReportModal(reportDonation);
                }}
              >
                + Додати новий звіт
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={closeReportsListModal}
              >
                Закрити
              </button>
            </div>
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
