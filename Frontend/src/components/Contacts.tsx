import React from "react";
import "./Contacts.css";
import contactsBackImage from "../img/backgrounds/Contacts/Contacts-back.jpg";
import Footer from "./Footer";

const Contacts: React.FC = () => {
  return (
    <div
      className="kontakty-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${contactsBackImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <div className="content-section">
        <div className="container">
          <div className="contact-info-horizontal">
            <h2>Контактна інформація</h2>
            <div className="contact-items-row">
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h3>Телефон</h3>
                  <p>+380 (93) 38 02 208</p>
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
            </div>
          </div>

          <div className="contact-form-wide">
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
      </div>
      <Footer />
    </div>
  );
};

export default Contacts;
