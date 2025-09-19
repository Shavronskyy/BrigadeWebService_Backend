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

        // Fetch reports for each donation
        const donationsWithReports = await Promise.all(
          data.map(async (donation) => {
            try {
              const reports = await donationsApiService.getReportsByDonationId(
                donation.id
              );
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

        // Sort donations: active first, then completed, both sorted by creation date (newest first)
        const sortedDonations = donationsWithReports.sort((a, b) => {
          // If one is completed and the other isn't, prioritize active
          if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1;
          }
          // If both have same completion status, sort by date (newest first)
          return (
            new Date(b.creationDate).getTime() -
            new Date(a.creationDate).getTime()
          );
        });

        setDonations(sortedDonations);
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
              {donations.map((donation) => {
                console.log(
                  `Support: Rendering donation ${donation.id}:`,
                  donation
                );
                console.log(
                  `Support: Reports for donation ${donation.id}:`,
                  donation.reports
                );
                return (
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
                      {/* Reports button - only show if there are reports */}
                      {donation.reports && donation.reports.length > 0 && (
                        <button
                          className="reports-button"
                          onClick={() => openReportModal(donation)}
                          title="Переглянути звіти"
                        >
                          📊 Звіти про використання коштів (
                          {donation.reports.length})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
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
                <div className="reports-grid">
                  {selectedReport.reports.map((report, index) => (
                    <div key={report.id} className="report-card">
                      {report.img && (
                        <div className="report-image">
                          <img src={report.img} alt={report.title} />
                        </div>
                      )}
                      <div className="report-content">
                        <h4 className="report-title">{report.title}</h4>
                        <div className="report-meta">
                          <span className="report-category">
                            {report.category}
                          </span>
                          <span className="report-date">
                            {new Date(report.createdAt).toLocaleDateString(
                              "uk-UA"
                            )}
                          </span>
                        </div>
                        <div className="report-description">
                          <p>{report.description}</p>
                        </div>
                        {report.img && (
                          <button className="report-photo-btn">📷 Фото</button>
                        )}
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
