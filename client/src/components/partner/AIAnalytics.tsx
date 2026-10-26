import api from "@/utils/axios";
import {
    AlertTriangle,
    CheckCircle2,
    Circle,
    ListChecks,
    RefreshCw,
    Rocket,
    Sparkles,
    Trophy,
    type LucideIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface AnalyticsData {
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

interface AIAnalyticsProps {
    analyticsData: AnalyticsData;
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

interface ProductPerformance {
    productId: string;
    product: string;
    sales: number;
    revenue: number;
}

interface SalesTrend {
    date: string;
    sales: number;
}

export interface PartnerAnalytics {
    summary: AnalyticsData["summary"];
    charts: {
        productPerformance: ProductPerformance[];
        salesTrend: SalesTrend[];
    };
    aiResponse: AIAnalytics;
}

export interface AIAnalyticsResult {
    aiAnalytics: PartnerAnalytics;
    cached: boolean;
    expiresIn: number;
    success?: boolean;
    message?: string;
}

const INSIGHT_META: Record<
    "positive" | "warning" | "neutral",
    { icon: LucideIcon; className: string }
> = {
    warning: {
        icon: AlertTriangle,
        className:
            "border-amber-400/20 bg-amber-400/10 text-amber-300",
    },
    neutral: {
        icon: Circle,
        className:
            "border-slate-400/20 bg-slate-400/10 text-slate-300",
    },
    positive: {
        icon: CheckCircle2,
        className:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    },
};

const AIAnalytics = ({ analyticsData }: AIAnalyticsProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [aiResponse, setAiResponse] = useState<PartnerAnalytics | null>(null);
    const [cached, setCached] = useState<boolean>(false);
    const [expiresIn, setExpiresIn] = useState<number | null>(null);

    const handleAnalytics = async () => {
        setLoading(true);

        try {
            const { data } = await api.post<AIAnalyticsResult>(
                "/api/ai/analytics",
                analyticsData,
            );

            if (data.success) {
                setAiResponse(data.aiAnalytics);
                setCached(data.cached);
                setExpiresIn(data.expiresIn);

                if (data.cached) {
                    toast.success("Latest AI analytics loaded");
                } else {
                    toast.success("AI analytics generated successfully");
                }
            }
        } catch (error) {
            toast.error("Failed to generate AI analytics");
        } finally {
            setLoading(false);
        }
    };

    const getCachedTime = () => {
        if (expiresIn === null || expiresIn <= 0) {
            return null;
        }

        const mins = Math.ceil(expiresIn / 60);

        return `${mins} min`;
    };

    return (
        <div className="flex w-full flex-col gap-5 text-slate-200 sm:gap-6">
            <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#0b0d1f]/80 p-5 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.4)] ring-1 ring-white/5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                            <Sparkles className="size-5" />
                        </div>

                        <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                            AI Analytics
                        </h3>

                        {aiResponse && (
                            <Badge className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-500/15">
                                Powered by Groq
                            </Badge>
                        )}
                    </div>

                    <p className="max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                        Get AI-powered insights about your sales, products and growth.
                    </p>
                </div>

                <Button
                    onClick={handleAnalytics}
                    disabled={loading}
                    className="h-11 w-full shrink-0 rounded-xl border border-indigo-400/20 bg-indigo-500 px-5 font-semibold text-white shadow-lg shadow-indigo-950/20 transition-all duration-200 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                    {loading ? (
                        <>
                            <RefreshCw className="mr-2 size-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 size-4" />
                            Check AI Analytics
                        </>
                    )}
                </Button>
            </div>

            {cached && (
                <p className="rounded-xl border border-indigo-400/15 bg-indigo-500/5 px-4 py-3 text-sm leading-6 text-slate-400">
                    Showing cached analytics. New data will be generated after{" "}
                    <span className="font-semibold text-indigo-300">
                        {getCachedTime()}
                    </span>
                </p>
            )}

            {!aiResponse && !loading && (
                <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 text-slate-200 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.3)] ring-1 ring-white/5 backdrop-blur-xl">
                    <CardContent className="flex flex-col items-center justify-center gap-4 px-5 py-12 text-center sm:py-16">
                        <div className="flex size-16 items-center justify-center rounded-3xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 shadow-lg shadow-indigo-950/20">
                            <Sparkles className="size-7" />
                        </div>

                        <p className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                            Ready to analyze your store
                        </p>

                        <p className="max-w-md text-sm leading-6 text-slate-400">
                            Click &quot;Check AI Analytics&quot; to get AI-powered insights.
                        </p>
                    </CardContent>
                </Card>
            )}

            {aiResponse && (
                <div className="flex flex-col gap-5 sm:gap-6">
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        <Card className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 text-slate-200 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.3)] ring-1 ring-white/5 backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/20">
                            <CardHeader className="border-b border-white/10 p-5 sm:p-6">
                                <CardTitle className="text-base font-semibold tracking-tight text-white sm:text-lg">
                                    Sales Trend
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-4 pt-5 sm:p-6">
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={aiResponse.charts.salesTrend}>
                                        <defs>
                                            <linearGradient
                                                id="salesGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.65} />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#ffffff"
                                            strokeOpacity={0.08}
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="date"
                                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                                            axisLine={{ stroke: "#ffffff", strokeOpacity: 0.12 }}
                                            tickLine={false}
                                            tickMargin={10}
                                        />

                                        <YAxis
                                            allowDecimals={false}
                                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                                            axisLine={false}
                                            tickLine={false}
                                            width={32}
                                        />

                                        <Tooltip
                                            cursor={{ fill: "#818cf8", fillOpacity: 0.08 }}
                                            contentStyle={{
                                                backgroundColor: "#10132a",
                                                border: "1px solid rgba(255,255,255,0.12)",
                                                borderRadius: "12px",
                                                color: "#e2e8f0",
                                                boxShadow: "0 16px 40px -20px rgba(0,0,0,0.8)",
                                            }}
                                            labelStyle={{ color: "#c7d2fe", marginBottom: 4 }}
                                            itemStyle={{ color: "#e0e7ff" }}
                                        />

                                        <Bar
                                            dataKey="sales"
                                            fill="url(#salesGradient)"
                                            radius={[6, 6, 0, 0]}
                                            maxBarSize={48}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 text-slate-200 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.3)] ring-1 ring-white/5 backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/20">
                            <CardHeader className="border-b border-white/10 p-5 sm:p-6">
                                <CardTitle className="text-base font-semibold tracking-tight text-white sm:text-lg">
                                    Product Performance
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-4 pt-5 sm:p-6">
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart
                                        data={aiResponse.charts.productPerformance}
                                        layout="vertical"
                                        margin={{ left: 20, right: 20 }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="performanceGradient"
                                                x1="0"
                                                y1="0"
                                                x2="1"
                                                y2="0"
                                            >
                                                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8} />
                                                <stop offset="100%" stopColor="#818cf8" stopOpacity={1} />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#ffffff"
                                            strokeOpacity={0.08}
                                            vertical={false}
                                        />

                                        <XAxis
                                            type="number"
                                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                                            axisLine={{ stroke: "#ffffff", strokeOpacity: 0.12 }}
                                            tickLine={false}
                                        />

                                        <YAxis
                                            type="category"
                                            width={90}
                                            dataKey="product"
                                            tick={{ fill: "#cbd5e1", fontSize: 11 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />

                                        <Tooltip
                                            cursor={{ fill: "#818cf8", fillOpacity: 0.08 }}
                                            formatter={(value: any) => [
                                                `₹${Number(value).toFixed(2)}`,
                                                "Revenue",
                                            ]}
                                            contentStyle={{
                                                backgroundColor: "#10132a",
                                                border: "1px solid rgba(255,255,255,0.12)",
                                                borderRadius: "12px",
                                                color: "#e2e8f0",
                                                boxShadow: "0 16px 40px -20px rgba(0,0,0,0.8)",
                                            }}
                                            labelStyle={{ color: "#c7d2fe", marginBottom: 4 }}
                                            itemStyle={{ color: "#e0e7ff" }}
                                        />

                                        <Bar
                                            dataKey="revenue"
                                            fill="url(#performanceGradient)"
                                            radius={[0, 6, 6, 0]}
                                            maxBarSize={36}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 text-slate-200 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.3)] ring-1 ring-white/5 backdrop-blur-xl">
                        <CardHeader className="border-b border-white/10 p-5 sm:p-6">
                            <CardTitle className="flex items-center gap-3 text-base font-semibold tracking-tight text-white sm:text-lg">
                                <span className="flex size-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                                    <Sparkles className="size-5" />
                                </span>
                                AI Summary
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-5 sm:p-6">
                            <p className="text-sm leading-7 text-slate-300 sm:text-base">
                                {aiResponse.aiResponse.summary}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 text-slate-200 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.3)] ring-1 ring-white/5 backdrop-blur-xl">
                        <CardHeader className="border-b border-white/10 p-5 sm:p-6">
                            <CardTitle className="text-base font-semibold tracking-tight text-white sm:text-lg">
                                AI Insights
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-6">
                            {aiResponse.aiResponse.insights.map((insight, index) => {
                                const meta = INSIGHT_META[insight.type];
                                const Icon = meta.icon;

                                return (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors duration-200 sm:gap-4 sm:p-5 ${meta.className}`}
                                    >
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-current/15 bg-black/10">
                                            <Icon className="size-5" />
                                        </div>

                                        <div className="min-w-0 flex-1 space-y-1.5">
                                            <p className="text-sm font-semibold sm:text-base">
                                                {insight.title}
                                            </p>

                                            <p className="text-sm leading-6 text-slate-300">
                                                {insight.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 text-slate-200 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.3)] ring-1 ring-white/5 backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/20">
                            <CardHeader className="border-b border-white/10 p-5 sm:p-6">
                                <CardTitle className="flex items-center gap-3 text-base font-semibold tracking-tight text-white sm:text-lg">
                                    <span className="flex size-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
                                        <Trophy className="size-5" />
                                    </span>
                                    Top Product
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-3 p-5 sm:p-6">
                                <p className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                                    {aiResponse.aiResponse.topProduct.title}
                                </p>

                                <p className="text-sm leading-6 text-slate-400">
                                    {aiResponse.aiResponse.topProduct.reason}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 text-slate-200 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.3)] ring-1 ring-white/5 backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/20">
                            <CardHeader className="border-b border-white/10 p-5 sm:p-6">
                                <CardTitle className="flex items-center gap-3 text-base font-semibold tracking-tight text-white sm:text-lg">
                                    <span className="flex size-10 items-center justify-center rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-300">
                                        <Rocket className="size-5" />
                                    </span>
                                    Growth Opportunity
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-5 sm:p-6">
                                <p className="text-sm leading-7 text-slate-300 sm:text-base">
                                    {aiResponse.aiResponse.growthOpportunity}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 text-slate-200 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.3)] ring-1 ring-white/5 backdrop-blur-xl">
                        <CardHeader className="border-b border-white/10 p-5 sm:p-6">
                            <CardTitle className="flex items-center gap-3 text-base font-semibold tracking-tight text-white sm:text-lg">
                                <span className="flex size-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                                    <ListChecks className="size-5" />
                                </span>
                                Recommended Actions
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-6">
                            {aiResponse.aiResponse.recommendations.map((r, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/2.5 p-4 transition-colors duration-200 hover:border-indigo-400/20 hover:bg-white/4 sm:gap-4 sm:p-5"
                                >
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-sm font-semibold tabular-nums text-indigo-300">
                                        {i + 1}
                                    </span>

                                    <p className="min-w-0 flex-1 pt-1 text-sm leading-6 text-slate-300 sm:text-base">
                                        {r}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AIAnalytics;
