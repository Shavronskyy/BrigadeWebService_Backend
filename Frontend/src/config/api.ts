export const API_CONFIG = {
  BASE_URL: "http://localhost:3000",
  ENDPOINTS: {
    DONATIONS: "/api/Donations",
    CAMPAIGNS: "/api/Campaigns",
    REPORTS: "/api/Reports",
    VACANCIES: "/api/Vacancy",
  },
};

export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};
