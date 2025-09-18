import { getApiUrl, API_CONFIG } from "../config/api";

export interface ReportCreateModel {
  id?: number;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  img: string;
  isPublished: boolean;
  createdAt: string;
}

export interface Report extends ReportCreateModel {
  id: number;
  createdAt: string;
}

export interface ImageUploadResponse {
  url: string;
}

class ReportsApiService {
  private baseUrl = getApiUrl("REPORTS");

  private formatImageUrl(url: string): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${API_CONFIG.BASE_URL}${url}`;
    return `${API_CONFIG.BASE_URL}/${url}`;
  }

  async getAllReports(): Promise<Report[]> {
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

      const reports: any[] = await response.json();

      // Format image URLs for all reports
      return reports.map((report: any) => ({
        ...report,
        img: this.formatImageUrl(report.img),
      }));
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  }

  async createReport(report: ReportCreateModel): Promise<Report> {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
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

      // Format image URL
      return {
        ...result,
        img: this.formatImageUrl(result.img),
      };
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  }

  async updateReport(report: ReportCreateModel): Promise<Report> {
    try {
      const response = await fetch(`${this.baseUrl}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
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

      // Format image URL
      return {
        ...result,
        img: this.formatImageUrl(result.img),
      };
    } catch (error) {
      console.error("Error updating report:", error);
      throw error;
    }
  }

  async deleteReport(id: number): Promise<void> {
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
      console.error("Error deleting report:", error);
      throw error;
    }
  }

  async uploadImage(
    reportId: number,
    file: File
  ): Promise<ImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${this.baseUrl}/${reportId}/image`, {
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

  async deleteImage(reportId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${reportId}/image`, {
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
}

export const reportsApiService = new ReportsApiService();
