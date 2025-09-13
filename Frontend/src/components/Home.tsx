import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { reportsApiService, Report } from "../services/reportsApi";

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
      <div className="hero-section">
        <div className="hero-content">
          <h1>Військова Бригада</h1>
          <p>Захищаємо нашу землю та свободу</p>
          <Link to="/reports" className="hero-btn">
            Переглянути всі звіти
          </Link>
        </div>
      </div>

      <div className="content-section">
        <div className="container">
          <section className="about-section">
            <h2>Про нас</h2>
            <p>
              Наша бригада - це професійне військове формування, яке виконує
              завдання з захисту територіальної цілісності та суверенітету
              України. Ми складаємося з досвідчених бійців, які пройшли навчання
              за найвищими стандартами сучасного військового мистецтва.
            </p>
          </section>

          <section className="tasks-section">
            <h2>Наші завдання</h2>
            <div className="tasks-grid">
              <div className="task-card">
                <h3>Оборона території</h3>
                <p>
                  Захист населених пунктів та стратегічних об'єктів від ворожих
                  дій
                </p>
              </div>
              <div className="task-card">
                <h3>Гуманітарна допомога</h3>
                <p>Надання допомоги цивільному населенню в зоні бойових дій</p>
              </div>
              <div className="task-card">
                <h3>Відновлення інфраструктури</h3>
                <p>
                  Роботи з відновлення життєво важливих систем населених пунктів
                </p>
              </div>
            </div>
          </section>

          <section className="activity-section">
            <h2>Сфера діяльності</h2>
            <p>
              Наша бригада діє в різних напрямках: від безпосередніх бойових
              операцій до гуманітарних місій та відновлення інфраструктури. Ми
              працюємо в тісній координації з місцевою владою та міжнародними
              організаціями для забезпечення максимальної ефективності наших
              дій.
            </p>
          </section>

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
              <div className="error">{error}</div>
            ) : lastReports.length === 0 ? (
              <div className="no-reports">Ви ще не додали жодного звіту</div>
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
    </div>
  );
};

export default Home;
