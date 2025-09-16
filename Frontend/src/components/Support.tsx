import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Support.css";
import { campaignsApiService, Campaign } from "../services/campaignsApi";
import Footer from "./Footer";

const Support: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await campaignsApiService.getAllCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="support-page">
      <div className="content-section">
        <div className="container">
          <div className="support-header">
            <h1>Завершені збори</h1>
          </div>

          {loading ? (
            <div className="loading">Завантаження зборів...</div>
          ) : campaigns.length === 0 ? (
            <div className="no-campaigns">Наразі немає активних зборів</div>
          ) : (
            <div className="campaigns-list">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="campaign-card">
                  <div className="campaign-image">
                    <img src={campaign.image} alt={campaign.title} />
                    {campaign.isCompleted && (
                      <div className="completed-overlay">
                        <span>Збір завершено!</span>
                      </div>
                    )}
                  </div>
                  <div className="campaign-content">
                    <div className="campaign-date">{campaign.date}</div>
                    <h3 className="campaign-title">{campaign.title}</h3>
                    <div className="campaign-goal">
                      Мета збору: <strong>{campaign.goal}</strong>
                    </div>
                    <div className="campaign-description">
                      <p>
                        <strong>Опис збору:</strong>
                      </p>
                      <p>{campaign.description}</p>
                    </div>
                    {campaign.link && (
                      <div className="campaign-link">
                        <a
                          href={campaign.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="campaign-link-btn"
                        >
                          Перейти до збору
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
