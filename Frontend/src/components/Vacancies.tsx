import React, { useState, useEffect } from "react";
import "./Vacancies.css";
import { vacanciesApiService, Vacancy } from "../services/vacanciesApi";
import vacanciesBackImage from "../img/backgrounds/Vacancies/Vacancies-back.jpg";
import Footer from "./Footer";

const Vacancies: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

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
                <div key={vacancy.id} className="vacancy-item">
                  <div className="vacancy-header">
                    <h3>{vacancy.title}</h3>
                    <span className="vacancy-type">
                      {vacancy.employmentType}
                    </span>
                  </div>
                  <div className="vacancy-details">
                    <div className="vacancy-info">
                      <span className="info-item">
                        💰 Зарплата: {vacancy.salary}
                      </span>
                      <span className="info-item">
                        🎓 Освіта: {vacancy.educationLevel}
                      </span>
                      <span className="info-item">
                        📅 Опубліковано:{" "}
                        {new Date(vacancy.postedDate).toLocaleDateString(
                          "uk-UA"
                        )}
                      </span>
                    </div>
                    <p className="vacancy-description">{vacancy.description}</p>
                    {vacancy.requirements &&
                      vacancy.requirements.length > 0 && (
                        <div className="vacancy-requirements">
                          <h4>Вимоги:</h4>
                          <ul>
                            {vacancy.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    <div className="vacancy-contact">
                      <p>
                        <strong>Контактний телефон:</strong>{" "}
                        {vacancy.contactPhone}
                      </p>
                    </div>
                    <button className="apply-btn">Подати заявку</button>
                  </div>
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
