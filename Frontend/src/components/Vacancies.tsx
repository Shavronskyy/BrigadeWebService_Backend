import React, { useState, useEffect } from "react";
import "./Vacancies.css";
import { vacanciesApiService, Vacancy } from "../services/vacanciesApi";

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
    <div className="vakansii-page">
      <div className="page-header">
        <div className="container">
          <h1>Вакансії</h1>
          <p>Приєднуйтесь до нашої бригади та захищайте Батьківщину</p>
        </div>
      </div>

      <div className="content-section">
        <div className="container">
          <div className="vacancy-intro">
            <h2>Чому варто служити в нашій бригаді?</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">🎖️</div>
                <h3>Професійний розвиток</h3>
                <p>
                  Можливості для кар'єрного росту та отримання нових навичок
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">💰</div>
                <h3>Гарна оплата</h3>
                <p>
                  Конкурентна зарплата та додаткові виплати за особливі умови
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🏠</div>
                <h3>Соціальні гарантії</h3>
                <p>
                  Повне забезпечення та соціальний пакет для військовослужбовців
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">👥</div>
                <h3>Командна робота</h3>
                <p>Дружній колектив та підтримуюча атмосфера</p>
              </div>
            </div>
          </div>

          <div className="vacancies-list">
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

          <div className="application-section">
            <h2>Як подати заявку?</h2>
            <div className="application-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Заповніть форму</h3>
                <p>Надішліть своє резюме та коротке мотиваційне письмо</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Співбесіда</h3>
                <p>Пройдіть співбесіду з командуванням та медичну комісію</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Прийняття на службу</h3>
                <p>Отримайте призначення та приєднуйтесь до бригади</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vacancies;
