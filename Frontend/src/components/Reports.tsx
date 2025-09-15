import React, { useState, useEffect } from "react";
import "./Reports.css";
import { reportsApiService, Report } from "../services/reportsApi";
import reportsBackImage from "../img/backgrounds/Contacts/Contacts-back.jpg";
import Footer from "./Footer";

interface ReportDisplay {
  id: number;
  title: string;
  shortText: string;
  fullText: string;
  photo: string;
  date: string;
  category: string;
}

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportDisplay | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [reports, setReports] = useState<ReportDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reportsApiService.getAllReports();

        // Transform API data to display format
        const transformedReports: ReportDisplay[] = data.map((report) => ({
          id: report.id,
          title: report.title,
          shortText: report.shortDescription,
          fullText: report.description,
          photo: report.img || "/img/report1.jpg", // Fallback image
          date: new Date(report.createdAt).toLocaleDateString("uk-UA"),
          category: report.category,
        }));

        setReports(transformedReports);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setError("Помилка завантаження звітів");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const openModal = (report: ReportDisplay) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div
      className="reports-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${reportsBackImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <div className="content-section">
        <div className="container">
          <div className="reports-block">
            <h2>Волонтерські звіти</h2>

            {loading ? (
              <div className="loading">Завантаження звітів...</div>
            ) : reports.length === 0 ? (
              <div className="no-reports">Наразі немає звітів</div>
            ) : (
              <div className="reports-grid">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="report-card"
                    onClick={() => openModal(report)}
                  >
                    <div className="report-photo">
                      <img src={report.photo} alt={report.title} />
                    </div>
                    <div className="report-content">
                      <h3>{report.title}</h3>
                      <p className="report-short-text">{report.shortText}</p>
                      <div className="report-meta">
                        <span className="report-category">
                          {report.category}
                        </span>
                        <span className="report-date">{report.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedReport && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            <div className="modal-header">
              <img
                src={selectedReport.photo}
                alt={selectedReport.title}
                className="modal-photo"
              />
              <div className="modal-title-section">
                <h2>{selectedReport.title}</h2>
                <div className="modal-meta">
                  <span className="modal-category">
                    {selectedReport.category}
                  </span>
                  <span className="modal-date">{selectedReport.date}</span>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <p>{selectedReport.fullText}</p>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Reports;
