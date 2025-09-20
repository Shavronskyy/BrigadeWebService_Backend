export const API_CONFIG = {
  BASE_URL: "http://localhost:5192",
  ENDPOINTS: {
    DONATIONS: "/api/Donations",
    CAMPAIGNS: "/api/Campaigns",
    REPORTS: "/api/Reports",
    VACANCIES: "/api/Vacancy",
    CONTACT: "/api/Contact",
  },
  CONTACT_EMAIL: "dima.shavronskyi@gmail.com",
};

export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};
