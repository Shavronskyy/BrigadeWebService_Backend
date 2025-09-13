export interface VacancyCreateModel {
  id?: number;
  title: string;
  description: string;
  postedDate: string;
  contactPhone: string;
  requirements?: string[];
  salary: string;
  employmentType: string;
  educationLevel: string;
}

export interface Vacancy extends VacancyCreateModel {
  id: number;
  postedDate: string;
}

class VacanciesApiService {
  private baseUrl = "http://127.0.0.1:5000/api/Vacancy";

  async getAllVacancies(): Promise<Vacancy[]> {
    try {
      const response = await fetch(`${this.baseUrl}/GetAllVacancies`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching vacancies:", error);
      throw error;
    }
  }

  async createVacancy(vacancy: VacancyCreateModel): Promise<Vacancy> {
    try {
      const response = await fetch(`${this.baseUrl}/CreateVacancy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vacancy),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating vacancy:", error);
      throw error;
    }
  }

  async updateVacancy(vacancy: VacancyCreateModel): Promise<Vacancy> {
    try {
      const response = await fetch(`${this.baseUrl}/UpdateVacancy`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vacancy),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating vacancy:", error);
      throw error;
    }
  }

  async deleteVacancy(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/DeleteVacancy/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      throw error;
    }
  }
}

export const vacanciesApiService = new VacanciesApiService();
