import React, { useState, useEffect } from "react";
import "./Vacancies.css";
import { vacanciesApiService, Vacancy } from "../services/vacanciesApi";
import vacanciesBackImage from "../img/backgrounds/Vacancies/Vacancies-back.jpg";
import Footer from "./Footer";

const Vacancies: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedVacancy, setExpandedVacancy] = useState<number | null>(null);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const data = await vacanciesApiService.getAllVacancies();
        setVacancies(data);
      } catch (error) {
        console.error("Failed to fetch vacancies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  const toggleVacancy = (vacancyId: number) => {
    setExpandedVacancy(expandedVacancy === vacancyId ? null : vacancyId);
  };

  return (
    <div
      className="vakansii-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${vacanciesBackImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <div className="content-section">
        <div className="container">
          <div className="vacancies-block">
            <h2>Відкриті вакансії</h2>

            {loading ? (
              <div className="loading">Завантаження вакансій...</div>
            ) : vacancies.length === 0 ? (
              <div className="no-vacancies">
                Наразі немає відкритих вакансій
              </div>
            ) : (
              vacancies.map((vacancy) => (
                <div key={vacancy.id} className="vacancy-accordion-item">
                  <div
                    className="vacancy-accordion-header"
                    onClick={() => toggleVacancy(vacancy.id)}
                  >
                    <h3 className="vacancy-title">{vacancy.title}</h3>
                    <span className="vacancy-toggle-icon">
                      {expandedVacancy === vacancy.id ? "−" : "+"}
                    </span>
                  </div>
                  {expandedVacancy === vacancy.id && (
                    <div className="vacancy-accordion-content">
                      <div className="vacancy-short-description">
                        {vacancy.description}
                      </div>
                      <button className="apply-btn-accordion">
                        ПОДАТИ ЗАЯВКУ
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Vacancies;
