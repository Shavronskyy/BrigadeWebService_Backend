import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import { reportsApiService } from "../services/reportsApi";
import mainBackImage from "../img/backgrounds/Home/main-back.jpg";
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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState<ReportDisplay | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastReports, setLastReports] = useState<ReportDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch last 3 reports from API
  useEffect(() => {
    const fetchLastReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reportsApiService.getAllReports();

        // Transform API data to display format and take only last 3
        const transformedReports: ReportDisplay[] = data
          .slice(0, 3)
          .map((report) => ({
            id: report.id,
            title: report.title,
            shortText: report.shortDescription,
            fullText: report.description,
            photo: report.img || "/img/report1.jpg", // Fallback image
            date: new Date(report.createdAt).toLocaleDateString("uk-UA"),
            category: report.category,
          }));

        setLastReports(transformedReports);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setError("Помилка завантаження звітів");
      } finally {
        setLoading(false);
      }
    };

    fetchLastReports();
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
    <div className="home-page">
      <div
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${mainBackImage})`,
        }}
      >
        <div className="hero-content">
          <h1>АРСЕНАЛ</h1>
          <div className="hero-actions">
            <div className="hero-left">
              <button
                className="hero-btn"
                onClick={() => navigate("/vacancies")}
              >
                Приєднуйся до нас!
              </button>
            </div>
            <div className="hero-right">
              <button className="hero-btn">Підтримати</button>
            </div>
          </div>
          <div
            className="scroll-indicator"
            onClick={() => {
              const nextSection = document.querySelector(".content-section");
              nextSection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="container">
          <section className="reports-section">
            <div className="section-header">
              <h2>Останні звіти</h2>
              <Link to="/reports" className="view-all-btn">
                Переглянути всі
              </Link>
            </div>
            {loading ? (
              <div className="loading">Завантаження звітів...</div>
            ) : error ? (
              <div className="no-reports">Наразі немає відкритих вакансій</div>
            ) : lastReports.length === 0 ? (
              <div className="no-reports">Наразі немає звітів</div>
            ) : (
              <div className="reports-grid">
                {lastReports.map((report) => (
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
          </section>
        </div>
      </div>

      {/* Modal for reports */}
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

export default Home;
