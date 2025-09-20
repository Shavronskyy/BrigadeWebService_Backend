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
        let errorData: any = {};
        try {
          const responseText = await response.text();
          if (responseText && responseText.trim() !== "") {
            errorData = JSON.parse(responseText);
          }
        } catch {
          // If JSON parsing fails, use empty object
        }
        const errorMessage =
          errorData.message ||
          errorData.title ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Check if response is empty
      const responseText = await response.text();
      if (!responseText || responseText.trim() === "") {
        return [];
      }

      const reports: any[] = JSON.parse(responseText);

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
        let errorData: any = {};
        try {
          const responseText = await response.text();
          if (responseText && responseText.trim() !== "") {
            errorData = JSON.parse(responseText);
          }
        } catch {
          // If JSON parsing fails, use empty object
        }
        const errorMessage =
          errorData.message ||
          errorData.title ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Check if response has content before parsing JSON
      const responseText = await response.text();

      if (
        !responseText ||
        responseText.trim() === "" ||
        responseText.trim() === "OK"
      ) {
        // Backend returns just Ok() - create result from input data
        const result = {
          id: Date.now(), // Temporary ID - will be updated after image upload
          title: report.title,
          description: report.description,
          shortDescription: report.shortDescription,
          category: report.category,
          img: report.img,
          isPublished: report.isPublished,
          createdAt: report.createdAt,
        };
        return {
          ...result,
          img: this.formatImageUrl(result.img),
        };
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.warn(
          "Failed to parse JSON response, creating minimal result:",
          parseError
        );
        const minimalResult = {
          id: Date.now(), // Temporary ID
          title: report.title,
          description: report.description,
          shortDescription: report.shortDescription,
          category: report.category,
          img: report.img,
          isPublished: report.isPublished,
          createdAt: report.createdAt,
        };
        return {
          ...minimalResult,
          img: this.formatImageUrl(minimalResult.img),
        };
      }

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
        let errorData: any = {};
        try {
          const responseText = await response.text();
          if (responseText && responseText.trim() !== "") {
            errorData = JSON.parse(responseText);
          }
        } catch {
          // If JSON parsing fails, use empty object
        }
        const errorMessage =
          errorData.message ||
          errorData.title ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Check if response has content before parsing JSON
      const responseText = await response.text();

      if (
        !responseText ||
        responseText.trim() === "" ||
        responseText.trim() === "OK"
      ) {
        // Backend returns just Ok() - return the input report as result
        return {
          ...report,
          img: this.formatImageUrl(report.img),
        } as Report;
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.warn(
          "Failed to parse JSON response, using input data:",
          parseError
        );
        return {
          ...report,
          img: this.formatImageUrl(report.img),
        } as Report;
      }

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
        let errorData: any = {};
        try {
          const responseText = await response.text();
          if (responseText && responseText.trim() !== "") {
            errorData = JSON.parse(responseText);
          }
        } catch {
          // If JSON parsing fails, use empty object
        }
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
        let errorData: any = {};
        try {
          const responseText = await response.text();
          if (responseText && responseText.trim() !== "") {
            errorData = JSON.parse(responseText);
          }
        } catch {
          // If JSON parsing fails, use empty object
        }
        const errorMessage =
          errorData.message ||
          errorData.title ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Check if response has content before parsing JSON
      const responseText = await response.text();

      if (!responseText || responseText.trim() === "") {
        // If no response body, create a minimal result object
        return {
          url: "", // Empty URL if no response
        };
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.warn(
          "Failed to parse JSON response in uploadImage:",
          parseError
        );
        return {
          url: "", // Empty URL if parsing fails
        };
      }

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
        let errorData: any = {};
        try {
          const responseText = await response.text();
          if (responseText && responseText.trim() !== "") {
            errorData = JSON.parse(responseText);
          }
        } catch {
          // If JSON parsing fails, use empty object
        }
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
