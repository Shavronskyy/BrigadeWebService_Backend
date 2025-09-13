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
  private baseUrl = "http://127.0.0.1:5000/api/Reports";

  private formatImageUrl(url: string): string {
    if (!url) return "/img/report1.jpg";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `http://127.0.0.1:5000${url}`;
    return `http://127.0.0.1:5000/${url}`;
  }

  async getAllReports(): Promise<Report[]> {
    try {
      const response = await fetch(`${this.baseUrl}/GetAllReports`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
      const response = await fetch(`${this.baseUrl}/CreateReport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
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
      console.error("Error creating report:", error);
      throw error;
    }
  }

  async updateReport(report: ReportCreateModel): Promise<Report> {
    try {
      const response = await fetch(`${this.baseUrl}/UpdateReport`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
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
      console.error("Error updating report:", error);
      throw error;
    }
  }

  async deleteReport(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/DeleteReport/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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

  async deleteImage(reportId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${reportId}/image`, {
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

export const reportsApiService = new ReportsApiService();
