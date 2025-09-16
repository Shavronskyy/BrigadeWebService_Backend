import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import mainBackImage from "../img/backgrounds/Home/main-back.jpg";
import Footer from "./Footer";

const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Facebook SDK
    if (window.FB) {
      window.FB.XFBML.parse();
    } else {
      // Wait for Facebook SDK to load
      window.fbAsyncInit = function () {
        window.FB.init({
          xfbml: true,
          version: "v18.0",
        });
      };
    }
  }, []);

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
          <section className="facebook-feed-section">
            <div className="section-header">
              <h2>Наші новини</h2>
              <a
                href="https://www.facebook.com/groups/546401331898688"
                target="_blank"
                rel="noopener noreferrer"
                className="view-all-btn"
              >
                Перейти до групи
              </a>
            </div>
            <div className="facebook-feed-container">
              <iframe
                src="https://www.facebook.com/plugins/group.php?href=https%3A%2F%2Fwww.facebook.com%2Fgroups%2F546401331898688&width=100%&height=700&show_metadata=false&adapt_container_width=true&small_header=false&hide_cover=false&show_facepile=true&tabs=timeline"
                width="100%"
                height="700"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Group Feed"
              ></iframe>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
