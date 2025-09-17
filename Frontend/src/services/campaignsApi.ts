export interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: string;
  date: string;
  image: string;
  link: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface CampaignCreateModel {
  id?: number;
  title: string;
  description: string;
  goal: string;
  date: string;
  image: string;
  link: string;
  isCompleted: boolean;
  createdAt: string;
}

class CampaignsApiService {
  private baseUrl = "http://127.0.0.1:5000/api/Campaigns";

  async getAllCampaigns(): Promise<Campaign[]> {
    try {
      const response = await fetch(`${this.baseUrl}/GetAllCampaigns`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      throw error;
    }
  }

  async getCampaignById(id: number): Promise<Campaign | null> {
    try {
      const response = await fetch(`${this.baseUrl}/GetCampaignById/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching campaign:", error);
      throw error;
    }
  }

  async createCampaign(campaign: CampaignCreateModel): Promise<Campaign> {
    try {
      const response = await fetch(`${this.baseUrl}/CreateCampaign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaign),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw error;
    }
  }

  async updateCampaign(campaign: CampaignCreateModel): Promise<Campaign> {
    try {
      const response = await fetch(`${this.baseUrl}/UpdateCampaign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaign),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating campaign:", error);
      throw error;
    }
  }

  async deleteCampaign(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/DeleteCampaign/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      throw error;
    }
  }

  async toggleCampaignStatus(id: number): Promise<Campaign> {
    try {
      const response = await fetch(
        `${this.baseUrl}/ToggleCampaignStatus/${id}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error toggling campaign status:", error);
      throw error;
    }
  }
}

export const campaignsApiService = new CampaignsApiService();
