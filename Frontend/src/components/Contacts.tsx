import React from "react";
import "./Contacts.css";

const Contacts: React.FC = () => {
  return (
    <div className="kontakty-page">
      <div className="page-header">
        <div className="container">
          <h1>Контакти</h1>
          <p>Зв'яжіться з командуванням бригади для координації дій</p>
        </div>
      </div>

      <div className="content-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Контактна інформація</h2>

              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h3>Штаб бригади</h3>
                  <p>вул. Дегтярівська 19а, Kyiv, Ukraine</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h3>Телефон</h3>
                  <p>+380 73 211 0222</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-details">
                  <h3>Email</h3>
                  <p>
                    brigade@army.mil.ua
                    <br />
                    volunteer@army.mil.ua
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🕒</div>
                <div className="contact-details">
                  <h3>Години роботи</h3>
                  <p>
                    Пн-Пт: 8:00 - 20:00
                    <br />
                    Сб-Нд: 9:00 - 18:00
                    <br />
                    Дежурний: 24/7
                  </p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h2>Напишіть нам</h2>
              <form className="form">
                <div className="form-group">
                  <label htmlFor="name">Ім'я *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Ваше ім'я"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Ваш email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Телефон</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Ваш телефон"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Тема *</label>
                  <select id="subject" name="subject" required>
                    <option value="">Оберіть тему</option>
                    <option value="volunteer">Волонтерська допомога</option>
                    <option value="humanitarian">Гуманітарна допомога</option>
                    <option value="coordination">Координація дій</option>
                    <option value="other">Інше</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Повідомлення *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Ваше повідомлення"
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  Надіслати повідомлення
                </button>
              </form>
            </div>
          </div>

          <section className="map-section">
            <h2>Розташування штабу</h2>
            <div className="map-placeholder">
              <div className="map-content">
                <h3>Штаб бригади</h3>
                <p>вул. Дегтярівська 19а, Kyiv, Ukraine</p>
                <p>Поруч з метро "Лук'янівська", в історичному районі міста</p>
                <button className="map-btn">Відкрити на карті</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
