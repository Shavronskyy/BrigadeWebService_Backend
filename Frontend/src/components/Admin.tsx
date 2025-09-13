import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Admin.css";
import AdminVacancies from "./AdminVacancies";
import AdminReports from "./AdminReports";

type AdminSection = "vacancies" | "reports";

const Admin: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>("vacancies");

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>Панель адміністратора</h1>
              <p>Управління контентом та налаштування системи</p>
            </div>
            <div className="user-info">
              <span>Вітаємо, {user?.username || user?.email}</span>
              <button onClick={logout} className="logout-admin-btn">
                Вийти
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          <div className="admin-navigation">
            <button
              className={`nav-btn ${
                activeSection === "vacancies" ? "active" : ""
              }`}
              onClick={() => setActiveSection("vacancies")}
            >
              <span className="nav-icon">💼</span>
              Вакансії
            </button>
            <button
              className={`nav-btn ${
                activeSection === "reports" ? "active" : ""
              }`}
              onClick={() => setActiveSection("reports")}
            >
              <span className="nav-icon">📊</span>
              Звіти
            </button>
          </div>

          <div className="admin-section">
            {activeSection === "vacancies" && <AdminVacancies />}
            {activeSection === "reports" && <AdminReports />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
