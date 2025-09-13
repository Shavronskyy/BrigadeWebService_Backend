import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <Link to="/" onClick={closeMenu}>
              <img
                src="/header-logo.svg"
                alt="Логотип бригади"
                className="logo-image"
              />
            </Link>
          </div>
        </div>

        <div
          className={`burger-menu ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={closeMenu}>
                Головна
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/reports" className="nav-link" onClick={closeMenu}>
                Звітність
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contacts" className="nav-link" onClick={closeMenu}>
                Контакти
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/vacancies" className="nav-link" onClick={closeMenu}>
                Вакансії
              </Link>
            </li>
          </ul>

          <div className="auth-buttons">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="nav-link login-link"
                onClick={closeMenu}
              >
                Вхід
              </Link>
            ) : (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="nav-link admin-link"
                    onClick={closeMenu}
                  >
                    Адмін
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="nav-link logout-btn"
                >
                  Вийти
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
