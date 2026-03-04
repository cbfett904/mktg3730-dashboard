import { useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ─── DATA FROM SPREADSHEET ─────────────────────────────────────────────────
const BRANDS = [
  {
    id: "hidden-bronco-gems", name: "Hidden Bronco Gems", cls: 110, team: 3,
    ig_handle: "hiddenbronco_gems", fb_handle: null,
    up1: { ig_fol: 0, fb_fol: 0, posts: 4, ig_views: null, ig_reach: null, ig_int: null, ig_visits: null, ig_likes: null },
    up2: { ig_fol: 640, fb_fol: 5, posts: 12, ig_views: null, ig_reach: null, ig_int: null, ig_visits: null, ig_likes: null, avg_views: 2422 },
  },
  {
    id: "busted-broncos", name: "Busted Broncos", cls: 115, team: 1,
    ig_handle: "bustedbroncos", fb_handle: null,
    up1: { ig_fol: 150, fb_fol: 0, posts: null, ig_views: null, ig_reach: null, ig_int: null, ig_visits: null, ig_likes: null },
    up2: { ig_fol: 609, fb_fol: 4, posts: 13, ig_views: 27257, ig_reach: 2401, ig_int: null, ig_visits: null, ig_likes: 368 },
  },
  {
    id: "bronco-bites", name: "Bronco Bites", cls: 110, team: 6,
    ig_handle: "bronco_bites2026", fb_handle: null,
    up1: { ig_fol: 0, fb_fol: 0, posts: 2, ig_views: 2449, ig_reach: 985, ig_int: 60, ig_visits: 258, ig_likes: 48 },
    up2: { ig_fol: 244, fb_fol: 1, posts: null, ig_views: null, ig_reach: null, ig_int: null, ig_visits: null, ig_likes: null },
  },
  {
    id: "feeding-the-zoo", name: "Feeding the Zoo", cls: 110, team: 1,
    ig_handle: "feeding.thezoo", fb_handle: null,
    up1: { ig_fol: 6, fb_fol: 0, posts: 3, ig_views: null, ig_reach: null, ig_int: null, ig_visits: null, ig_likes: null },
    up2: { ig_fol: 143, fb_fol: 27, posts: null, ig_views: 2600, ig_reach: null, ig_int: 140, ig_visits: null, ig_likes: null },
  },
  {
    id: "michigan-meditation", name: "Michigan Meditation", cls: 110, team: 5,
    ig_handle: "michigan_meditations", fb_handle: null,
    up1: { ig_fol: 0, fb_fol: 0, posts: null, ig_views: 115, ig_reach: 37, ig_int: 8, ig_visits: 160, ig_likes: null },
    up2: { ig_fol: 144, fb_fol: 2, posts: null, ig_views: 1200, ig_reach: 300, ig_int: 55, ig_visits: 700, ig_likes: null },
  },
  {
    id: "kzoo-kravings", name: "Kzoo Kravings", cls: 115, team: 4,
    ig_handle: "kzoo.kravings", fb_handle: null,
    up1: { ig_fol: 41, fb_fol: 0, posts: 2, ig_views: 1983, ig_reach: 720, ig_int: 39, ig_visits: 255, ig_likes: 28 },
    up2: { ig_fol: 125, fb_fol: 0, posts: 8, ig_views: 20200, ig_reach: 2800, ig_int: 191, ig_visits: 700, ig_likes: null },
  },
  {
    id: "broncos-between-classes", name: "Broncos Between Classes", cls: 110, team: 4,
    ig_handle: "broncosbetweenclasses", fb_handle: null,
    up1: { ig_fol: 84, fb_fol: 0, posts: null, ig_views: null, ig_reach: null, ig_int: null, ig_visits: null, ig_likes: null },
    up2: { ig_fol: 122, fb_fol: 3, posts: 4, ig_views: 4400, ig_reach: 2155, ig_int: 88, ig_visits: null, ig_likes: 58 },
  },
  {
    id: "budget-broncos", name: "Budget Broncos", cls: 115, team: 2,
    ig_handle: "budgetbroncos", fb_handle: null,
    up1: { ig_fol: 4, fb_fol: 0, posts: 1, ig_views: null, ig_reach: null, ig_int: null, ig_visits: 74, ig_likes: 1 },
    up2: { ig_fol: 140, fb_fol: 0, posts: null, ig_views: null, ig_reach: null, ig_int: null, ig_visits: null, ig_likes: null },
  },
  {
    id: "deals-hq", name: "Deals HQ", cls: 115, team: 3,
    ig_handle: "dealshq_", fb_handle: null,
    up1: { ig_fol: 36, fb_fol: 0, posts: null, ig_views: null, ig_reach: null, ig_int: null, ig_visits: null, ig_likes: null },
    up2: { ig_fol: 118, fb_fol: 0, posts: null, ig_views: null, ig_reach: null, ig_int: null, ig_visits: null, ig_likes: null },
  },
  {
    id: "bronco-on-a-budget", name: "Bronco on a Budget", cls: 110, team: 7,
    ig_handle: "broncosonabudget", fb_handle: "Broncos on a Budget",
    up1: { ig_fol: 0, fb_fol: 30, posts: null, ig_views: null, ig_reach: null, ig_int: null, ig_visits: null, ig_likes: null },
    up2: { ig_fol: 32, fb_fol: 54, posts: null, ig_views: 824, ig_reach: 179, ig_int: 49, ig_visits: null, ig_likes: 50 },
  },
  {
    id: "bronco-basics", name: "Bronco Basics", cls: 110, team: 2,
    ig_handle: "broncobasics", fb_handle: "Bronco Basics",
    up1: { ig_fol: 23, fb_fol: 13, posts: 2, ig_views: 643, ig_reach: 361, ig_int: 33, ig_visits: null, ig_likes: 14 },
    up2: { ig_fol: 48, fb_fol: 14, posts: 6, ig_views: 9198, ig_reach: 1941, ig_int: null, ig_visits: 111, ig_likes: null },
  },
];

const C = {
  bg: "#0B0E14", card: "#141820", border: "#1E2430", text: "#E8ECF1",
  muted: "#6B7A90", accent: "#3B82F6", accentSoft: "#1E3A5F",
  ig: "#E1306C", igSoft: "#3D1525", fb: "#4267B2",
  green: "#10B981", greenSoft: "#0D3225", gold: "#F59E0B", red: "#EF4444",
};

const fmt = (n) => n == null ? "\u2014" : n.toLocaleString();
const pct = (a, b) => b === 0 ? "N/A" : `${Math.round(((a - b) / b) * 100)}%`;

const Card = ({ children, style }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, ...style }}>{children}</div>
);

const Stat = ({ label, value, sub, color = C.text }) => (
  <div style={{ textAlign: "center", flex: 1, minWidth: 120 }}>
    <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'Space Mono', monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{sub}</div>}
  </div>
);

const Badge = ({ children, color = C.accent, bg = C.accentSoft }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, color, background: bg, letterSpacing: 0.5, marginLeft: 4 }}>{children}</span>
);

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [classFilter, setClassFilter] = useState("all");
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const filtered = classFilter === "all" ? BRANDS : BRANDS.filter(b => b.cls === Number(classFilter));
  const sorted = [...filtered].sort((a, b) => (b.up2.ig_fol + b.up2.fb_fol) - (a.up2.ig_fol + a.up2.fb_fol));

  const totalUP1 = filtered.reduce((s, b) => s + b.up1.ig_fol + b.up1.fb_fol, 0);
  const totalUP2 = filtered.reduce((s, b) => s + b.up2.ig_fol + b.up2.fb_fol, 0);
  const hasLive = Object.keys(liveData).length > 0;
  const totalLive = hasLive ? filtered.reduce((s, b) => s + (liveData[b.id]?.ig ?? b.up2.ig_fol) + (liveData[b.id]?.fb ?? b.up2.fb_fol), 0) : null;
  const totalIG = filtered.reduce((s, b) => s + b.up2.ig_fol, 0);
  const totalFB = filtered.reduce((s, b) => s + b.up2.fb_fol, 0);

  const fetchLive = useCallback(async () => {
    setLoading(true);
    const handles = BRANDS.filter(b => b.ig_handle).map(b => `@${b.ig_handle}`).join(", ");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{
            role: "user",
            content: `Search for the current Instagram follower counts of these Western Michigan University student brand pages: ${handles}. These are small student-run accounts at WMU. Return ONLY a JSON object mapping each handle (without the @ symbol) to their current follower count as a number. If you cannot find a specific account's follower count, use null for that entry. Return ONLY valid JSON with no markdown formatting, no backticks, no explanation.`
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(i => i.text || "").filter(Boolean).join("\n").trim();
      if (text) {
        const clean = text.replace(/```json|```/g, "").trim();
        try {
          const parsed = JSON.parse(clean);
          const mapped = {};
          BRANDS.forEach(b => {
            if (b.ig_handle && parsed[b.ig_handle] != null) {
              mapped[b.id] = { ig: parsed[b.ig_handle], fb: b.up2.fb_fol };
            }
          });
          if (Object.keys(mapped).length > 0) {
            setLiveData(mapped);
            setLastFetched(new Date());
          }
        } catch (e) { console.error("JSON parse failed:", clean); }
      }
    } catch (err) { console.error("API error:", err); }
    setLoading(false);
  }, []);

  const followerBarData = sorted.map(b => ({
    name: b.name.length > 15 ? b.name.slice(0, 13) + "\u2026" : b.name,
    Instagram: liveData[b.id]?.ig ?? b.up2.ig_fol,
    Facebook: liveData[b.id]?.fb ?? b.up2.fb_fol,
  }));

  const timelineData = sorted.map(b => ({
    name: b.name.length > 13 ? b.name.slice(0, 11) + "\u2026" : b.name,
    "Update 1": b.up1.ig_fol + b.up1.fb_fol,
    "Update 2": b.up2.ig_fol + b.up2.fb_fol,
    ...(liveData[b.id] ? { Live: (liveData[b.id]?.ig ?? 0) + (liveData[b.id]?.fb ?? 0) } : {}),
  }));

  const platformPie = [
    { name: "Instagram", value: totalIG },
    { name: "Facebook", value: totalFB },
  ];

  const viewsData = sorted
    .filter(b => b.up2.ig_views)
    .map(b => ({ name: b.name.length > 13 ? b.name.slice(0, 11) + "\u2026" : b.name, Views: b.up2.ig_views, Reach: b.up2.ig_reach || 0 }));

  const tabBtn = (t, label) => (
    <button onClick={() => setTab(t)} style={{
      padding: "8px 18px", border: "none", borderRadius: 8, cursor: "pointer",
      fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
      background: tab === t ? C.accent : "transparent", color: tab === t ? "#fff" : C.muted,
    }}>{label}</button>
  );

  const filterBtn = (v, label) => (
    <button key={v} onClick={() => setClassFilter(v)} style={{
      padding: "5px 14px", border: `1px solid ${classFilter === v ? C.accent : C.border}`,
      borderRadius: 20, cursor: "pointer", fontSize: 11, fontWeight: 600,
      background: classFilter === v ? C.accentSoft : "transparent",
      color: classFilter === v ? C.accent : C.muted, fontFamily: "'DM Sans', sans-serif",
    }}>{label}</button>
  );

  const ts = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 12 };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}`}</style>

      {/* HEADER */}
      <div style={{ padding: "24px 28px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff" }}>W</div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>MKTG 3730 Analytics</h1>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: C.muted }}>Brand Page Performance Dashboard \u2014 Spring 2026</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={fetchLive} disabled={loading} style={{
              padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.green}`,
              background: loading ? C.greenSoft : "transparent", color: C.green,
              cursor: loading ? "wait" : "pointer", fontSize: 12, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans', sans-serif",
            }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: loading ? C.gold : C.green, animation: loading ? "pulse 1s infinite" : "none" }} />
              {loading ? "Fetching\u2026" : "Refresh Live Data"}
            </button>
            {lastFetched && <span style={{ fontSize: 11, color: C.muted }}>Updated {lastFetched.toLocaleTimeString()}</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 16 }}>
          {tabBtn("overview", "Overview")}
          {tabBtn("growth", "Growth")}
          {tabBtn("engagement", "Views & Reach")}
          {tabBtn("brands", "Brand Cards")}
        </div>
      </div>

      {/* FILTERS + KPIs */}
      <div style={{ padding: "16px 28px 0" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {filterBtn("all", "All Classes")}
          {filterBtn("110", "Section 110")}
          {filterBtn("115", "Section 115")}
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Card style={{ flex: 1, minWidth: 140, display: "flex" }}>
            <Stat label="UP2 Followers" value={fmt(totalUP2)} sub={`UP1: ${fmt(totalUP1)}`} />
          </Card>
          {totalLive != null && (
            <Card style={{ flex: 1, minWidth: 140, display: "flex", borderColor: C.green }}>
              <Stat label="Live Followers" value={fmt(totalLive)} color={C.green} sub={`+${fmt(totalLive - totalUP2)} since UP2`} />
            </Card>
          )}
          <Card style={{ flex: 1, minWidth: 140, display: "flex" }}>
            <Stat label="Net Growth" value={`+${fmt(totalUP2 - totalUP1)}`} color={C.green} sub={pct(totalUP2, totalUP1)} />
          </Card>
          <Card style={{ flex: 1, minWidth: 140, display: "flex" }}>
            <Stat label="Brand Pages" value={filtered.length} sub={classFilter === "all" ? "2 sections" : `Section ${classFilter}`} />
          </Card>
          <Card style={{ flex: 1, minWidth: 140, display: "flex" }}>
            <Stat label="IG Share" value={`${Math.round((totalIG / totalUP2) * 100)}%`} color={C.ig} sub={`${fmt(totalIG)} followers`} />
          </Card>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div style={{ padding: "16px 28px 32px" }}>

        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr", gap: 16, marginTop: 8 }}>
            <Card>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 12 }}>
                FOLLOWERS BY BRAND {hasLive && <Badge color={C.green} bg={C.greenSoft}>LIVE</Badge>}
              </div>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={followerBarData} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" width={110} tick={{ fill: C.text, fontSize: 10 }} />
                  <Tooltip contentStyle={ts} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Instagram" fill={C.ig} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="Facebook" fill={C.fb} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 12 }}>PLATFORM SPLIT</div>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={platformPie} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 11 }}>
                      <Cell fill={C.ig} />
                      <Cell fill={C.fb} />
                    </Pie>
                    <Tooltip contentStyle={ts} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 12 }}>TOP PERFORMERS</div>
                {sorted.slice(0, 5).map((b, i) => (
                  <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.gold, width: 18 }}>#{i + 1}</span>
                      <span style={{ fontSize: 12 }}>{b.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: liveData[b.id] ? C.green : C.text }}>
                      {fmt((liveData[b.id]?.ig ?? b.up2.ig_fol) + (liveData[b.id]?.fb ?? b.up2.fb_fol))}
                    </span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        )}

        {tab === "growth" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
            <Card>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 12 }}>UP1 \u2192 UP2 COMPARISON</div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={timelineData} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fill: C.text, fontSize: 10 }} />
                  <Tooltip contentStyle={ts} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Update 1" fill={C.muted} radius={[0, 3, 3, 0]} />
                  <Bar dataKey="Update 2" fill={C.accent} radius={[0, 3, 3, 0]} />
                  {hasLive && <Bar dataKey="Live" fill={C.green} radius={[0, 3, 3, 0]} />}
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 12 }}>NET FOLLOWER GROWTH</div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sorted.map(b => ({
                  name: b.name.length > 13 ? b.name.slice(0, 11) + "\u2026" : b.name,
                  Growth: (b.up2.ig_fol + b.up2.fb_fol) - (b.up1.ig_fol + b.up1.fb_fol),
                }))} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fill: C.text, fontSize: 10 }} />
                  <Tooltip contentStyle={ts} />
                  <Bar dataKey="Growth" fill={C.green} radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {tab === "engagement" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginTop: 8 }}>
            <Card>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 4 }}>INSTAGRAM VIEWS & REACH \u2014 UPDATE 2</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Only brands with reported data</div>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={viewsData} margin={{ left: 0, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="name" tick={{ fill: C.text, fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fill: C.muted, fontSize: 10 }} />
                  <Tooltip contentStyle={ts} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Views" fill={C.ig} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Reach" fill={C.gold} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 12 }}>ENGAGEMENT TABLE</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                      {["Brand", "Views", "Reach", "Interactions", "Profile Visits", "Likes", "Posts"].map(h => (
                        <th key={h} style={{ padding: "8px 6px", textAlign: h === "Brand" ? "left" : "center", color: C.muted, fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((b) => (
                      <tr key={b.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "7px 6px", fontWeight: 500 }}>{b.name}</td>
                        <td style={{ padding: "7px 6px", textAlign: "center", color: b.up2.ig_views ? C.text : C.muted }}>{fmt(b.up2.ig_views)}</td>
                        <td style={{ padding: "7px 6px", textAlign: "center", color: b.up2.ig_reach ? C.text : C.muted }}>{fmt(b.up2.ig_reach)}</td>
                        <td style={{ padding: "7px 6px", textAlign: "center", color: b.up2.ig_int ? C.text : C.muted }}>{fmt(b.up2.ig_int)}</td>
                        <td style={{ padding: "7px 6px", textAlign: "center", color: b.up2.ig_visits ? C.text : C.muted }}>{fmt(b.up2.ig_visits)}</td>
                        <td style={{ padding: "7px 6px", textAlign: "center", color: b.up2.ig_likes ? C.text : C.muted }}>{fmt(b.up2.ig_likes)}</td>
                        <td style={{ padding: "7px 6px", textAlign: "center", color: b.up2.posts ? C.text : C.muted }}>{fmt(b.up2.posts)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {tab === "brands" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
            {sorted.map(b => {
              const up1t = b.up1.ig_fol + b.up1.fb_fol;
              const up2t = b.up2.ig_fol + b.up2.fb_fol;
              const live = liveData[b.id];
              const livet = live ? (live.ig ?? 0) + (live.fb ?? 0) : null;
              const isExp = expanded === b.id;
              return (
                <Card key={b.id} style={{ cursor: "pointer", transition: "border-color 0.2s", borderColor: isExp ? C.accent : C.border }}
                  onClick={() => setExpanded(isExp ? null : b.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{b.name}</div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        <Badge color={C.muted} bg={C.bg}>Sec {b.cls}</Badge>
                        <Badge color={C.muted} bg={C.bg}>Team {b.team}</Badge>
                        {b.ig_handle && <Badge color={C.ig} bg={C.igSoft}>@{b.ig_handle}</Badge>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: live ? C.green : C.text }}>
                        {fmt(livet ?? up2t)}
                      </div>
                      <div style={{ fontSize: 11, color: C.green }}>+{fmt(up2t - up1t)} from UP1</div>
                    </div>
                  </div>
                  {isExp && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                      <div style={{ display: "grid", gridTemplateColumns: live ? "1fr 1fr 1fr" : "1fr 1fr", gap: 12, fontSize: 12 }}>
                        <div>
                          <div style={{ color: C.muted, fontWeight: 600, marginBottom: 8 }}>UPDATE 1</div>
                          <div>IG: {fmt(b.up1.ig_fol)} / FB: {fmt(b.up1.fb_fol)}</div>
                          {b.up1.ig_views != null && <div>Views: {fmt(b.up1.ig_views)}</div>}
                          {b.up1.ig_reach != null && <div>Reach: {fmt(b.up1.ig_reach)}</div>}
                          {b.up1.ig_int != null && <div>Interactions: {fmt(b.up1.ig_int)}</div>}
                          {b.up1.posts != null && <div>Posts: {b.up1.posts}</div>}
                        </div>
                        <div>
                          <div style={{ color: C.muted, fontWeight: 600, marginBottom: 8 }}>UPDATE 2</div>
                          <div>IG: {fmt(b.up2.ig_fol)} / FB: {fmt(b.up2.fb_fol)}</div>
                          {b.up2.ig_views != null && <div>Views: {fmt(b.up2.ig_views)}</div>}
                          {b.up2.ig_reach != null && <div>Reach: {fmt(b.up2.ig_reach)}</div>}
                          {b.up2.ig_int != null && <div>Interactions: {fmt(b.up2.ig_int)}</div>}
                          {b.up2.posts != null && <div>Posts: {b.up2.posts}</div>}
                        </div>
                        {live && (
                          <div>
                            <div style={{ color: C.green, fontWeight: 600, marginBottom: 8 }}>LIVE</div>
                            <div>IG: {fmt(live.ig)}</div>
                            <div>FB: {fmt(live.fb)}</div>
                            <div style={{ color: C.green, marginTop: 4 }}>+{fmt((live.ig ?? 0) - b.up2.ig_fol)} since UP2</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 24, padding: "16px 0", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted }}>
          <span>Data: Team presentations (UP1 ~Feb 3 \u00b7 UP2 ~Feb 23, 2026). Blank = not reported.</span>
          <span>MKTG 3730 \u00b7 Dr. Harvey \u00b7 Western Michigan University</span>
        </div>
      </div>
    </div>
  );
}
