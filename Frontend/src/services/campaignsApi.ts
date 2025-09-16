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

// Mock data for now - replace with actual API calls
const mockCampaigns: Campaign[] = [
  {
    id: 1,
    title: 'Поточні потреби "Птахів Мадяра"',
    description:
      "Щоденна потреба в матеріалах, паливі, мастилах, шинах, акумуляторах, портативній пам'яті та інших гаджетах для військових підрозділів та пілотів, щоб забезпечити цілодобову роботу та безпечний транспорт.",
    goal: "49 000 000 €",
    date: "10.12.2024",
    image: "https://via.placeholder.com/300x200/1a2e1a/ffffff?text=Campaign+1",
    link: "https://t.me/robert_magyar/12",
    isCompleted: true,
    createdAt: "2024-12-10T00:00:00Z",
  },
  {
    id: 2,
    title: "Збір на власне виробництво 30 тисяч протитанкових ПТМ-3",
    description:
      "Збір коштів на виробництво протитанкових мін для захисту території України.",
    goal: "15 000 000 €",
    date: "23.11.2024",
    image: "https://via.placeholder.com/300x200/2d4a2d/ffffff?text=Campaign+2",
    link: "https://example.com/campaign2",
    isCompleted: false,
    createdAt: "2024-11-23T00:00:00Z",
  },
];

class CampaignsApiService {
  private campaigns: Campaign[] = [...mockCampaigns];

  async getAllCampaigns(): Promise<Campaign[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...this.campaigns];
  }

  async getCampaignById(id: number): Promise<Campaign | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.campaigns.find((campaign) => campaign.id === id) || null;
  }

  async createCampaign(campaign: CampaignCreateModel): Promise<Campaign> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newCampaign: Campaign = {
      id: Math.max(...this.campaigns.map((c) => c.id), 0) + 1,
      ...campaign,
    };
    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  async updateCampaign(campaign: CampaignCreateModel): Promise<Campaign> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = this.campaigns.findIndex((c) => c.id === campaign.id);
    if (index === -1) {
      throw new Error("Campaign not found");
    }
    this.campaigns[index] = { ...campaign } as Campaign;
    return this.campaigns[index];
  }

  async deleteCampaign(id: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = this.campaigns.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Campaign not found");
    }
    this.campaigns.splice(index, 1);
  }

  async toggleCampaignStatus(id: number): Promise<Campaign> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const campaign = this.campaigns.find((c) => c.id === id);
    if (!campaign) {
      throw new Error("Campaign not found");
    }
    campaign.isCompleted = !campaign.isCompleted;
    return campaign;
  }
}

export const campaignsApiService = new CampaignsApiService();
