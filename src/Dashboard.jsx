import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const MONTHS = ["Aug '24", "Sep '24", "Oct '24", "Nov '24", "Dec '24", "Jan '25", "Feb '25", "Mar '25", "Apr '25", "May '25", "Jun '25", "Jul '25"];

const MEDIA_DATA = [
  { name: "Social", value: 59673816, color: "#E8A838" },
  { name: "TV", value: 35303973, color: "#D4472A" },
  { name: "Radio", value: 7564384, color: "#4A90A4" },
  { name: "Direct Mail", value: 5291413, color: "#6BAF6B" },
  { name: "Outdoor", value: 4818984, color: "#9B6BB5" },
  { name: "Digital", value: 3459682, color: "#E87A5D" },
  { name: "Press", value: 2388187, color: "#5BA3C9" },
  { name: "Door Drops", value: 953424, color: "#A8C97A" },
  { name: "Cinema", value: 32140, color: "#C4A882" },
];

const TOP_ADVERTISERS = [
  { name: "Cancer Research UK", total: 36660033, color: "#D4472A" },
  { name: "Macmillan Cancer Support", total: 30767252, color: "#4A90A4" },
  { name: "Marie Curie", total: 14679426, color: "#E8A838" },
  { name: "Breast Cancer Now", total: 13430246, color: "#E87A5D" },
  { name: "Prostate Cancer UK", total: 7567350, color: "#6BAF6B" },
  { name: "Children With Cancer UK", total: 3283113, color: "#9B6BB5" },
  { name: "Pancreatic Cancer UK", total: 1654699, color: "#5BA3C9" },
  { name: "Bloodwise", total: 1573810, color: "#A8C97A" },
  { name: "Teenage Cancer Trust", total: 1567803, color: "#C4A882" },
  { name: "World Cancer Research Fund", total: 1337035, color: "#8892A4" },
];

const MONTHLY_TOTALS = [7694959, 10432792, 11502103, 8345638, 8497059, 13425701, 10837046, 10645779, 7181118, 8867607, 12382262, 9673939];

const TOP5_MONTHLY = {
  "Cancer Research UK": [888305, 3309249, 3077098, 1610311, 1335886, 6151408, 3879775, 3521869, 1967302, 2838067, 5258268, 2822495],
  "Macmillan Cancer Support": [3336760, 2564612, 2139399, 1347495, 2687993, 3467249, 2769340, 2915198, 1640413, 2298642, 2464734, 3135417],
  "Marie Curie": [442082, 564563, 2096541, 2868228, 2109006, 1190814, 1453778, 1250641, 630115, 507630, 780204, 785824],
  "Breast Cancer Now": [1766965, 2416944, 1260768, 553830, 361192, 615810, 433879, 1405151, 1366864, 1107676, 1246318, 894849],
  "Prostate Cancer UK": [581863, 486605, 744736, 484351, 842256, 885483, 861630, 567106, 415472, 563807, 768841, 365200],
};

const TOP5_COLORS = {
  "Cancer Research UK": "#D4472A",
  "Macmillan Cancer Support": "#4A90A4",
  "Marie Curie": "#E8A838",
  "Breast Cancer Now": "#E87A5D",
  "Prostate Cancer UK": "#6BAF6B",
};

const fmt = (v) => v >= 1000000 ? `£${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `£${(v / 1000).toFixed(0)}K` : `£${v}`;
const fmtFull = (v) => `£${v.toLocaleString("en-GB")}`;

const monthlyChartData = MONTHS.map((m, i) => {
  const obj = { month: m, Total: MONTHLY_TOTALS[i] };
  Object.keys(TOP5_MONTHLY).forEach(adv => { obj[adv.split(" ")[0]] = TOP5_MONTHLY[adv][i]; });
  return obj;
});

const advBarData = TOP_ADVERTISERS.slice(0, 8).map(a => ({
  name: a.name.length > 20 ? a.name.split(" ").slice(0, 2).join(" ") : a.name,
  fullName: a.name,
  spend: a.total,
  color: a.color,
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1A1A2E", border: "1px solid #333", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <p style={{ color: "#aaa", marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <span style={{ color: "#fff" }}>{fmt(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div style={{ background: "#1A1A2E", border: "1px solid #333", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <p style={{ color: p.payload.color, fontWeight: 700 }}>{p.name}</p>
      <p style={{ color: "#fff" }}>{fmtFull(p.value)}</p>
      <p style={{ color: "#aaa" }}>{(p.payload.percent * 100).toFixed(1)}%</p>
    </div>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAdv, setSelectedAdv] = useState("Cancer Research UK");

  const totalSpend = MONTHLY_TOTALS.reduce((a, b) => a + b, 0);

  const advMonthlyData = MONTHS.map((m, i) => ({
    month: m,
    spend: TOP5_MONTHLY[selectedAdv]?.[i] ?? 0,
  }));

  const mediaByAdv = {
    "Cancer Research UK": [
      { name: "TV", value: 15116538 }, { name: "Social", value: 13799130 }, { name: "Radio", value: 3526146 },
      { name: "Outdoor", value: 2218217 }, { name: "Press", value: 1120603 }, { name: "Digital", value: 486808 },
      { name: "Door Drops", value: 358518 }, { name: "Cinema", value: 20711 }, { name: "Direct Mail", value: 13362 },
    ],
    "Macmillan Cancer Support": [
      { name: "Social", value: 15384797 }, { name: "TV", value: 10786083 }, { name: "Radio", value: 1678117 },
      { name: "Outdoor", value: 847930 }, { name: "Digital", value: 652591 }, { name: "Direct Mail", value: 541632 },
      { name: "Door Drops", value: 439590 }, { name: "Press", value: 425083 }, { name: "Cinema", value: 11429 },
    ],
    "Marie Curie": [
      { name: "Social", value: 6978376 }, { name: "TV", value: 4941053 }, { name: "Direct Mail", value: 1530823 },
      { name: "Digital", value: 832958 }, { name: "Radio", value: 345431 }, { name: "Press", value: 36895 }, { name: "Door Drops", value: 13890 },
    ],
    "Breast Cancer Now": [
      { name: "Social", value: 9200000 }, { name: "TV", value: 2500000 }, { name: "Press", value: 800000 },
      { name: "Digital", value: 500000 }, { name: "Radio", value: 430246 },
    ],
    "Prostate Cancer UK": [
      { name: "Social", value: 4100000 }, { name: "TV", value: 1900000 }, { name: "Press", value: 700000 },
      { name: "Digital", value: 500000 }, { name: "Radio", value: 367350 },
    ],
  };

  return (
    <div style={{ background: "#0D0D1A", minHeight: "100vh", color: "#E8E8F0", fontFamily: "'Georgia', 'Times New Roman', serif", padding: "0" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1A0A2E 0%, #0D1A2E 100%)", borderBottom: "1px solid #2A2A4A", padding: "28px 40px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ color: "#E8A838", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px", fontFamily: "monospace" }}>Nielsen · Cancer Charity Market</p>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#F0EEF8", letterSpacing: "-0.02em" }}>
              Advertising Spend Analysis
            </h1>
            <p style={{ margin: "6px 0 0", color: "#8888AA", fontSize: 13, fontStyle: "italic" }}>August 2024 – July 2025 · UK Market · Excluding Press Editorial</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, color: "#E8A838", fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }}>{fmt(totalSpend)}</p>
            <p style={{ margin: "2px 0 0", color: "#8888AA", fontSize: 12 }}>Total Market Spend</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 24 }}>
          {[["overview", "Market Overview"], ["advertisers", "Advertiser Breakdown"], ["channels", "Channel Mix"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                background: activeTab === id ? "#E8A838" : "transparent",
                color: activeTab === id ? "#0D0D1A" : "#8888AA",
                border: activeTab === id ? "none" : "1px solid #2A2A4A",
                borderRadius: 6,
                padding: "7px 18px",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: activeTab === id ? 700 : 400,
                transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "32px 40px" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            {/* KPI Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Peak Month", value: "Jan '25", sub: fmt(13425701) },
                { label: "Lowest Month", value: "Apr '25", sub: fmt(7181118) },
                { label: "Top Advertiser", value: "Cancer Research UK", sub: fmt(36660033) },
                { label: "Leading Channel", value: "Social Media", sub: `${((59673816/totalSpend)*100).toFixed(0)}% of total` },
              ].map((kpi, i) => (
                <div key={i} style={{ background: "#12122A", border: "1px solid #1E1E3A", borderRadius: 10, padding: "18px 20px" }}>
                  <p style={{ margin: "0 0 8px", color: "#8888AA", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>{kpi.label}</p>
                  <p style={{ margin: "0 0 4px", color: "#F0EEF8", fontSize: 17, fontWeight: 700 }}>{kpi.value}</p>
                  <p style={{ margin: 0, color: "#E8A838", fontSize: 13 }}>{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Monthly spend chart */}
            <div style={{ background: "#12122A", border: "1px solid #1E1E3A", borderRadius: 10, padding: "24px 24px 16px", marginBottom: 24 }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: "#C8C8E0", letterSpacing: "0.02em" }}>Monthly Total Market Spend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyChartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E3A" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#8888AA", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#8888AA", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Total" fill="#E8A838" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Top 5 monthly lines */}
              <div style={{ background: "#12122A", border: "1px solid #1E1E3A", borderRadius: 10, padding: "24px 24px 16px" }}>
                <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: "#C8C8E0" }}>Top 5 Advertisers — Monthly Trend</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E1E3A" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#8888AA", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#8888AA", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                    <Tooltip content={<CustomTooltip />} />
                    {Object.keys(TOP5_COLORS).map(adv => (
                      <Line key={adv} type="monotone" dataKey={adv.split(" ")[0]} stroke={TOP5_COLORS[adv]} strokeWidth={2} dot={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 12 }}>
                  {Object.entries(TOP5_COLORS).map(([adv, color]) => (
                    <span key={adv} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#8888AA" }}>
                      <span style={{ width: 12, height: 2, background: color, display: "inline-block", borderRadius: 2 }}></span>
                      {adv.split(" ")[0]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Media donut */}
              <div style={{ background: "#12122A", border: "1px solid #1E1E3A", borderRadius: 10, padding: "24px 24px 16px" }}>
                <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: "#C8C8E0" }}>Channel Mix — Total Market</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={MEDIA_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                      {MEDIA_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", marginTop: 8 }}>
                  {MEDIA_DATA.slice(0, 6).map(m => (
                    <span key={m.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#8888AA" }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: m.color, display: "inline-block", flexShrink: 0 }}></span>
                      {m.name} <span style={{ color: "#C8C8E0", marginLeft: "auto" }}>{((m.value / totalSpend) * 100).toFixed(0)}%</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADVERTISERS TAB */}
        {activeTab === "advertisers" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
              {/* Horizontal bar chart */}
              <div style={{ background: "#12122A", border: "1px solid #1E1E3A", borderRadius: 10, padding: "24px" }}>
                <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: "#C8C8E0" }}>Top 10 Advertisers by Total Spend</h3>
                {TOP_ADVERTISERS.map((adv, i) => {
                  const pct = (adv.total / TOP_ADVERTISERS[0].total) * 100;
                  return (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#C8C8E0", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adv.name}</span>
                        <span style={{ fontSize: 12, color: "#E8A838", fontVariantNumeric: "tabular-nums" }}>{fmt(adv.total)}</span>
                      </div>
                      <div style={{ background: "#1E1E3A", borderRadius: 3, height: 6, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: adv.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected advertiser detail */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Selector */}
                <div style={{ background: "#12122A", border: "1px solid #1E1E3A", borderRadius: 10, padding: "20px 24px" }}>
                  <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: "#C8C8E0" }}>Advertiser Deep-Dive</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {Object.keys(TOP5_MONTHLY).map(adv => (
                      <button key={adv} onClick={() => setSelectedAdv(adv)} style={{
                        background: selectedAdv === adv ? TOP5_COLORS[adv] : "transparent",
                        color: selectedAdv === adv ? "#0D0D1A" : "#8888AA",
                        border: `1px solid ${selectedAdv === adv ? TOP5_COLORS[adv] : "#2A2A4A"}`,
                        borderRadius: 5, padding: "5px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: selectedAdv === adv ? 700 : 400
                      }}>{adv.split(" ")[0]}</button>
                    ))}
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F0EEF8" }}>{fmt(TOP_ADVERTISERS.find(a => a.name === selectedAdv)?.total ?? 0)}</p>
                    <p style={{ margin: "2px 0 0", color: "#8888AA", fontSize: 12 }}>{selectedAdv} · Annual Total</p>
                    <p style={{ margin: "6px 0 0", color: "#E8A838", fontSize: 12 }}>
                      {((TOP_ADVERTISERS.find(a => a.name === selectedAdv)?.total ?? 0) / totalSpend * 100).toFixed(1)}% market share
                    </p>
                  </div>
                </div>

                {/* Monthly for selected */}
                <div style={{ background: "#12122A", border: "1px solid #1E1E3A", borderRadius: 10, padding: "20px 24px", flex: 1 }}>
                  <h4 style={{ margin: "0 0 12px", fontSize: 13, color: "#8888AA", fontWeight: 400 }}>Monthly Spend · {selectedAdv.split(" ")[0]}</h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={advMonthlyData} barSize={18}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E1E3A" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#666688", fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#666688", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="spend" fill={TOP5_COLORS[selectedAdv] ?? "#E8A838"} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Market share summary */}
            <div style={{ background: "#12122A", border: "1px solid #1E1E3A", borderRadius: 10, padding: "20px 24px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#C8C8E0" }}>Market Concentration</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {TOP_ADVERTISERS.slice(0, 5).map((adv, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: adv.color + "22", border: `2px solid ${adv.color}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 16, fontWeight: 700, color: adv.color }}>
                      {i + 1}
                    </div>
                    <p style={{ margin: "0 0 2px", fontSize: 11, color: "#C8C8E0", lineHeight: 1.3 }}>{adv.name.split(" ").slice(0, 2).join(" ")}</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#E8A838" }}>{((adv.total / totalSpend) * 100).toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CHANNELS TAB */}
        {activeTab === "channels" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
              {/* Channel spend bars */}
              <div style={{ background: "#12122A", border: "1px solid #1E1E3A", borderRadius: 10, padding: "24px" }}>
                <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: "#C8C8E0" }}>Total Spend by Channel</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={MEDIA_DATA} layout="vertical" barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E1E3A" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#8888AA", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#C8C8E0", fontSize: 12 }} axisLine={false} tickLine={false} width={75} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {MEDIA_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Channel stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignContent: "start" }}>
                {MEDIA_DATA.map((m, i) => (
                  <div key={i} style={{ background: "#12122A", border: `1px solid ${m.color}33`, borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <p style={{ margin: 0, fontSize: 12, color: "#8888AA" }}>{m.name}</p>
                      <span style={{ background: m.color + "22", color: m.color, fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                        {((m.value / totalSpend) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 700, color: "#F0EEF8" }}>{fmt(m.value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social vs TV dominance */}
            <div style={{ background: "#12122A", border: "1px solid #1E1E3A", borderRadius: 10, padding: "20px 24px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#C8C8E0" }}>Social & TV Combined Dominance</h3>
              <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", height: 32, borderRadius: 6, overflow: "hidden", gap: 2 }}>
                    {MEDIA_DATA.map((m, i) => (
                      <div key={i} style={{ flex: m.value, background: m.color, transition: "flex 0.4s", minWidth: m.value / totalSpend > 0.02 ? 2 : 0 }} title={`${m.name}: ${fmt(m.value)}`} />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                    {MEDIA_DATA.map(m => (
                      <span key={m.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#8888AA" }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: m.color, display: "inline-block" }}></span>
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "center", minWidth: 140 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 32, fontWeight: 700, color: "#E8A838" }}>
                    {(((59673816 + 35303973) / totalSpend) * 100).toFixed(0)}%
                  </p>
                  <p style={{ margin: 0, color: "#8888AA", fontSize: 12 }}>Social + TV combined</p>
                  <p style={{ margin: "4px 0 0", color: "#C8C8E0", fontSize: 13 }}>{fmt(59673816 + 35303973)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1E1E3A", padding: "16px 40px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#555577", fontSize: 11, fontFamily: "monospace" }}>Source: Nielsen · Aug 2024 – Jul 2025 · UK</span>
        <span style={{ color: "#555577", fontSize: 11, fontFamily: "monospace" }}>83 advertisers · 9 channels</span>
      </div>
    </div>
  );
}
