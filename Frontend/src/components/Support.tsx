import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Support.css";
import { donationsApiService, Donation } from "../services/donationsApi";
import Footer from "./Footer";

const Support: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await donationsApiService.getAllDonations();
        setDonations(data);
      } catch (error) {
        console.error("Failed to fetch donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

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
                    {donation.donationLink && (
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
      <Footer />
    </div>
  );
};

export default Support;
