import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Support.css";
import { donationsApiService, Donation } from "../services/donationsApi";
import Footer from "./Footer";

const Support: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Donation | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await donationsApiService.getAllDonations();
        setDonations(data);
      } catch (error) {
        console.error("Failed to fetch donations:", error);
        // You could add error state here if needed
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const openReportModal = (donation: Donation) => {
    setSelectedReport(donation);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="support-page">
      <div className="content-section">
        <div className="container">
          <div className="support-header">
            <h1>Збори на потреби підрозділу</h1>
          </div>

          {loading ? (
            <div className="loading">Завантаження зборів...</div>
          ) : donations.length === 0 ? (
            <div className="no-campaigns">Наразі немає активних зборів</div>
          ) : (
            <div className="campaigns-list">
              {donations.map((donation) => (
                <div key={donation.id} className="campaign-card">
                  <div className="campaign-image">
                    <img src={donation.img} alt={donation.title} />
                    {donation.isCompleted && (
                      <div className="completed-overlay">
                        <span>Збір завершено!</span>
                      </div>
                    )}
                  </div>
                  <div className="campaign-content">
                    <div className="campaign-date">
                      {new Date(donation.creationDate).toLocaleDateString(
                        "uk-UA"
                      )}
                    </div>
                    <h3 className="campaign-title">{donation.title}</h3>
                    <div className="campaign-goal">
                      Мета збору:{" "}
                      <strong>{donation.goal.toLocaleString()} ₴</strong>
                    </div>
                    <div className="campaign-description">
                      <p>
                        <strong>Опис збору:</strong>
                      </p>
                      <p>{donation.description}</p>
                    </div>
                    {donation.donationLink && !donation.isCompleted && (
                      <div className="campaign-link">
                        <a
                          href={donation.donationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="campaign-link-btn"
                        >
                          Підтримати збір
                        </a>
                      </div>
                    )}
                    {donation.isCompleted &&
                      donation.reports &&
                      donation.reports.length > 0 && (
                        <div className="campaign-report">
                          <div className="report-section">
                            <h4>
                              📊 Звіти про використання коштів (
                              {donation.reports.length})
                            </h4>
                            {donation.reports.map((report, index) => (
                              <div key={report.id} className="report-preview">
                                <h5>{report.title}</h5>
                                <p>{report.shortDescription}</p>
                                <small>Категорія: {report.category}</small>
                                <button
                                  className="report-btn"
                                  onClick={() => openReportModal(donation)}
                                >
                                  Читати повний звіт
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    <button className="details-btn">
                      Докладніше
                      <span className="arrow">↓</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isReportModalOpen && selectedReport && (
        <div className="modal-overlay" onClick={closeReportModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Звіт про використання коштів</h3>
              <button className="modal-close" onClick={closeReportModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {selectedReport.reports && selectedReport.reports.length > 0 && (
                <div className="report-content">
                  {selectedReport.reports.map((report, index) => (
                    <div key={report.id} className="report-item">
                      {report.img && (
                        <div className="report-image">
                          <img src={report.img} alt={report.title} />
                        </div>
                      )}
                      <h4>{report.title}</h4>
                      <div className="report-meta">
                        <span className="report-category">
                          Категорія: {report.category}
                        </span>
                        <span className="report-date">
                          Дата звіту:{" "}
                          {new Date(report.createdAt).toLocaleDateString(
                            "uk-UA"
                          )}
                        </span>
                      </div>
                      <div className="report-description">
                        <p>
                          <strong>Короткий опис:</strong>{" "}
                          {report.shortDescription}
                        </p>
                        <p>
                          <strong>Повний опис:</strong> {report.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Support;
