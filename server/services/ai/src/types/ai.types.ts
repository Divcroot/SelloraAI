export interface AnalyticsData {
    partner: {
        id: string;
        name: string;
    };
    summary: {
        totalRevenue: number;
        totalSales: number;
        totalProducts: number;
    };
    products: {
        id: string;
        title: string;
        type: string;
        price: number;
        totalRevenue: number;
        totalSales: number;
    }[];
    orders: {
        productTitle: string;
        partnerAmount: number;
        createdAt: string;
    }[];
}

export interface AIAnalytics {
    summary: string;
    insights: {
        type: "positive" | "warning" | "neutral";
        title: string;
        description: string;
    }[];
    recommendations: string[];
    topProduct: {
        title: string;
        reason: string;
    };
    growthOpportunity: string;
}