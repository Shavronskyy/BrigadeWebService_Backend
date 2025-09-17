export interface Donation {
  id: number;
  title: string;
  description: string;
  goal: number;
  creationDate: string;
  donationLink: string;
  img: string;
  isCompleted: boolean;
}

export interface DonationCreateModel {
  id?: number;
  title: string;
  description: string;
  goal: number;
  creationDate: string;
  donationLink: string;
  img: string;
  isCompleted: boolean;
}

export interface ImageUploadResponse {
  url: string;
}

class DonationsApiService {
  private baseUrl = "http://127.0.0.1:5000/api/Donations";

  private formatImageUrl(url: string): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `http://127.0.0.1:5000${url}`;
    return `http://127.0.0.1:5000/${url}`;
  }

  async getAllDonations(): Promise<Donation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getAll`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const donations: any[] = await response.json();

      // Format image URLs for all donations
      return donations.map((donation: any) => ({
        ...donation,
        img: this.formatImageUrl(donation.img),
      }));
    } catch (error) {
      console.error("Error fetching donations:", error);
      throw error;
    }
  }

  async createDonation(donation: DonationCreateModel): Promise<Donation> {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donation),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: any = await response.json();

      // Format image URL
      return {
        ...result,
        img: this.formatImageUrl(result.img),
      };
    } catch (error) {
      console.error("Error creating donation:", error);
      throw error;
    }
  }

  async updateDonation(donation: DonationCreateModel): Promise<Donation> {
    try {
      const response = await fetch(`${this.baseUrl}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donation),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: any = await response.json();

      // Format image URL
      return {
        ...result,
        img: this.formatImageUrl(result.img),
      };
    } catch (error) {
      console.error("Error updating donation:", error);
      throw error;
    }
  }

  async deleteDonation(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting donation:", error);
      throw error;
    }
  }

  async uploadImage(
    donationId: number,
    file: File
  ): Promise<ImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${this.baseUrl}/${donationId}/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Convert relative URL to absolute URL if needed
      if (result.url && !result.url.startsWith("http")) {
        result.url = `http://127.0.0.1:5000${result.url}`;
      }

      return result;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  async deleteImage(donationId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${donationId}/image`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }
}

export const donationsApiService = new DonationsApiService();
