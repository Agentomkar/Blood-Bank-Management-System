"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView } from "framer-motion";
import {
  TrendingUp,
  Activity,
  Users,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Clock,
  HeartPulse,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";
import { fetchJson } from "@/lib/fetchJson";

const donationTrend = [
  { month: "Jan", donations: 320, requests: 280 },
  { month: "Feb", donations: 380, requests: 310 },
  { month: "Mar", donations: 350, requests: 340 },
  { month: "Apr", donations: 420, requests: 390 },
  { month: "May", donations: 480, requests: 420 },
  { month: "Jun", donations: 520, requests: 460 },
  { month: "Jul", donations: 580, requests: 500 },
  { month: "Aug", donations: 540, requests: 490 },
  { month: "Sep", donations: 610, requests: 530 },
  { month: "Oct", donations: 650, requests: 570 },
  { month: "Nov", donations: 700, requests: 610 },
  { month: "Dec", donations: 750, requests: 650 },
];

const bloodTypeDist = [
  { name: "O+", value: 38, count: 38, color: "#DC143C" },
  { name: "A+", value: 28, count: 28, color: "#8B0000" },
  { name: "B+", value: 18, count: 18, color: "#FF6B6B" },
  { name: "AB+", value: 8, count: 8, color: "#FF9999" },
  { name: "O-", value: 4, count: 4, color: "#CC1F1F" },
  { name: "A-", value: 2, count: 2, color: "#A81414" },
  { name: "B-", value: 1.5, count: 1.5, color: "#771818" },
  { name: "AB-", value: 0.5, count: 0.5, color: "#400808" },
];

type BloodGroupChartItem = {
  name: string;
  value: number;
  count: number;
  color: string;
};

type RecentDonor = {
  donorId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bloodGroup: string;
  status: string;
  createdAt: string;
};

type StatsPayload = {
  totalUnits: number;
  donorCount: number;
  newRegistrations: number;
  requestCount: number;
  pendingRequests: number;
  recentDonors: RecentDonor[];
  bloodGroupStats: Array<{ bloodGroup: string; count: number }>;
};

const weeklyDonations = [
  { day: "Mon", units: 42 },
  { day: "Tue", units: 58 },
  { day: "Wed", units: 65 },
  { day: "Thu", units: 47 },
  { day: "Fri", units: 72 },
  { day: "Sat", units: 85 },
  { day: "Sun", units: 54 },
];

const recentActivity = [
  { action: "New donor registered", name: "Sarah M.", time: "2 min ago", type: "new" },
  { action: "Blood request fulfilled", name: "City General", time: "8 min ago", type: "fulfilled" },
  { action: "Emergency request", name: "St. Mary's", time: "15 min ago", type: "urgent" },
  { action: "Donation completed", name: "James K.", time: "22 min ago", type: "donation" },
  { action: "Inventory restocked", name: "Central Bank", time: "35 min ago", type: "inventory" },
];

const subscribeToClientSnapshot = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 group hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
          <Icon className="w-5 h-5 text-crimson-400" />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            positive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {change}
        </div>
      </div>
      <div className="font-display text-2xl font-bold text-white mb-1">
        {value}
      </div>
      <div className="text-xs text-white/40">{label}</div>
    </div>
  );
}

export default function DashboardPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const canRenderCharts = useSyncExternalStore(
    subscribeToClientSnapshot,
    getClientSnapshot,
    getServerSnapshot
  );

  const loadStats = async () => {
    try {
      const data = await fetchJson<StatsPayload>("/api/stats", {
        label: "Admin dashboard statistics",
        cache: "no-store",
      });
      setStats(data);
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
      setStats(null);
    }
  };

  useEffect(() => {
    window.setTimeout(loadStats, 0);
    const interval = window.setInterval(loadStats, 5000);
    window.addEventListener("lifestream:donor-registered", loadStats);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("lifestream:donor-registered", loadStats);
    };
  }, []);

  const adminBloodGroups = useMemo<BloodGroupChartItem[]>(() => {
    if (!stats?.bloodGroupStats?.length) return bloodTypeDist;
    const total = stats.bloodGroupStats.reduce((sum, item) => sum + Number(item.count), 0);
    const colors = ["#DC143C", "#8B0000", "#FF6B6B", "#FF9999", "#CC1F1F", "#A81414", "#771818", "#400808"];

    return stats.bloodGroupStats.map((item, index) => ({
      name: item.bloodGroup,
      value: total ? Math.round((Number(item.count) / total) * 100) : 0,
      count: Number(item.count),
      color: colors[index % colors.length],
    }));
  }, [stats]);

  const recentDonorActivity = stats?.recentDonors?.length
    ? stats.recentDonors.map((donor) => ({
        action: "New donor registered",
        name: `${donor.firstName} ${donor.lastName} - ${donor.bloodGroup}`,
        time: new Date(donor.createdAt).toLocaleString(),
        type: "new",
      }))
    : recentActivity;

  return (
    <section id="dashboard" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-crimson-900/8 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Building2 className="w-4 h-4 text-crimson-500" />
            <span className="text-sm font-medium text-white/60">
              Admin Dashboard
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-white">Powerful </span>
            <span className="gradient-text-red">Analytics</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Track new registrations, total donors, recent donor activity, and
            blood group statistics as LifeStream registrations arrive.
          </p>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <StatCard
            icon={HeartPulse}
            label="New Registrations"
            value={String(stats?.newRegistrations ?? 0)}
            change="Live"
            positive
          />
          <StatCard
            icon={Users}
            label="Total Donors"
            value={String(stats?.donorCount ?? 0)}
            change="DB"
            positive
          />
          <StatCard
            icon={Activity}
            label="Blood Requests"
            value={String(stats?.requestCount ?? 0)}
            change="All"
            positive={false}
          />
          <StatCard
            icon={AlertCircle}
            label="Pending Requests"
            value={String(stats?.pendingRequests ?? 0)}
            change="Open"
            positive
          />
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Area Chart - Donations vs Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 glass-strong rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Donations vs Requests
                </h3>
                <p className="text-xs text-white/40 mt-1">
                  Monthly trend for the past year
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded-full bg-crimson-500" />
                  Donations
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded-full bg-white/20" />
                  Requests
                </span>
              </div>
            </div>
            <div className="h-[280px]">
              {canRenderCharts && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={donationTrend}>
                    <defs>
                      <linearGradient id="donationGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#DC143C" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#DC143C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="requestGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1a1a1a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        color: "#fff",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="donations"
                      stroke="#DC143C"
                      fill="url(#donationGrad)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="rgba(255,255,255,0.3)"
                      fill="url(#requestGrad)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Pie Chart - Blood Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-strong rounded-3xl p-6"
          >
            <div className="mb-4">
              <h3 className="font-display text-lg font-bold text-white">
                Blood Group Statistics
              </h3>
              <p className="text-xs text-white/40 mt-1">Registered donor mix</p>
            </div>
            <div className="h-[200px]">
              {canRenderCharts && (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={adminBloodGroups}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {adminBloodGroups.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#1a1a1a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        color: "#fff",
                        fontSize: 12,
                      }}
                      formatter={(value) => [`${String(value ?? 0)}%`, "Share"]}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {adminBloodGroups.slice(0, 4).map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: d.color }}
                  />
                  <span className="text-white/50">
                    {d.name}{" "}
                    <span className="text-white font-medium">
                      {d.count}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-2 glass-strong rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  This Week&apos;s Donations
                </h3>
                <p className="text-xs text-white/40 mt-1">
                  Daily donation volume
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/40">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium">+18%</span>
                vs last week
              </div>
            </div>
            <div className="h-[220px]">
              {canRenderCharts && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyDonations}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.03)"
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1a1a1a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        color: "#fff",
                        fontSize: 12,
                      }}
                    />
                    <Bar
                      dataKey="units"
                      fill="#DC143C"
                      radius={[6, 6, 0, 0]}
                      opacity={0.8}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-strong rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-crimson-400" />
              <h3 className="font-display text-lg font-bold text-white">
                Recent Donors
              </h3>
            </div>
            <div className="space-y-4">
              {recentDonorActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      item.type === "urgent"
                        ? "bg-red-400 animate-pulse"
                        : item.type === "fulfilled"
                        ? "bg-emerald-400"
                        : item.type === "donation"
                        ? "bg-crimson-400"
                        : "bg-blue-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white/80">{item.action}</div>
                    <div className="text-xs text-white/30 mt-0.5">
                      {item.name} - {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
