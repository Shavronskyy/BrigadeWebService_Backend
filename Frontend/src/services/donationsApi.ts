import { getApiUrl, API_CONFIG } from "../config/api";

export interface Report {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  img: string;
  isPublished: boolean;
  createdAt: string;
  donationId: number;
}

export interface Donation {
  id: number;
  title: string;
  description: string;
  goal: number;
  creationDate: string;
  donationLink: string;
  img: string;
  isCompleted: boolean;
  reports: Report[];
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

export interface ReportCreateModel {
  id?: number;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  img: string;
  isPublished: boolean;
  donationId: number;
  createdAt: string;
}

export interface ImageUploadResponse {
  url: string;
}

class DonationsApiService {
  private baseUrl = getApiUrl("DONATIONS");

  private formatImageUrl(url: string): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${API_CONFIG.BASE_URL}${url}`;
    return `${API_CONFIG.BASE_URL}/${url}`;
  }

  async getAllDonations(): Promise<Donation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getAll`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          errorData.title ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const donations: any[] = await response.json();

      // Format image URLs for all donations and their reports
      return donations.map((donation: any) => ({
        ...donation,
        img: this.formatImageUrl(donation.img),
        reports:
          donation.reports?.map((report: any) => ({
            ...report,
            img: this.formatImageUrl(report.img),
          })) || [],
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
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          errorData.title ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result: any = await response.json();

      // Format image URLs for donation and reports
      return {
        ...result,
        img: this.formatImageUrl(result.img),
        reports:
          result.reports?.map((report: any) => ({
            ...report,
            img: this.formatImageUrl(report.img),
          })) || [],
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
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          errorData.title ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result: any = await response.json();

      // Format image URLs for donation and reports
      return {
        ...result,
        img: this.formatImageUrl(result.img),
        reports:
          result.reports?.map((report: any) => ({
            ...report,
            img: this.formatImageUrl(report.img),
          })) || [],
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
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          errorData.title ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
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
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          errorData.title ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Convert relative URL to absolute URL if needed
      if (result.url && !result.url.startsWith("http")) {
        result.url = `${API_CONFIG.BASE_URL}${result.url}`;
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
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          errorData.title ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }

  async addReportToDonation(
    donationId: number,
    reportData: ReportCreateModel
  ): Promise<Donation> {
    try {
      console.log("API: Creating report for donation ID:", donationId);
      console.log("API: Report data:", reportData);

      // Create request body with donationId (backend expects it in both query and body)
      const requestBody = {
        id: reportData.id,
        title: reportData.title,
        description: reportData.description,
        shortDescription: reportData.shortDescription,
        category: reportData.category,
        img: reportData.img,
        isPublished: reportData.isPublished,
        donationId: donationId, // Include donationId in the body
        createdAt: reportData.createdAt,
      };

      console.log("API: Request body:", requestBody);
      console.log("API: URL:", `${this.baseUrl}/${donationId}/createReport`);

      const response = await fetch(
        `${this.baseUrl}/${donationId}/createReport`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        console.log("API: Error response status:", response.status);
        const errorData = await response.json().catch(() => ({}));
        console.log("API: Error response data:", errorData);

        // Try different possible error message fields
        const errorMessage =
          errorData.message ||
          errorData.title ||
          errorData.detail ||
          errorData.error ||
          errorData.exception ||
          `HTTP error! status: ${response.status}`;

        console.log("API: Parsed error message:", errorMessage);
        throw new Error(errorMessage);
      }

      const result: any = await response.json();
      return {
        ...result,
        img: this.formatImageUrl(result.img),
        reports:
          result.reports?.map((report: any) => ({
            ...report,
            img: this.formatImageUrl(report.img),
          })) || [],
      };
    } catch (error) {
      console.error("Error adding report to donation:", error);
      throw error;
    }
  }

  async toggleDonationStatus(id: number): Promise<Donation> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/completeDonation`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          errorData.title ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result: any = await response.json();
      return {
        ...result,
        img: this.formatImageUrl(result.img),
        reports:
          result.reports?.map((report: any) => ({
            ...report,
            img: this.formatImageUrl(report.img),
          })) || [],
      };
    } catch (error) {
      console.error("Error toggling donation status:", error);
      throw error;
    }
  }
}

export const donationsApiService = new DonationsApiService();
