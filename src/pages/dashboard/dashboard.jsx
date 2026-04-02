import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Users, CalendarCheck, TrendingUp, XCircle,
  Clock, ChevronRight, Activity, Wallet,
  CheckCircle2, AlertCircle, Ban, Stethoscope,
  FlaskConical, HeartPulse, Syringe,
} from "lucide-react";

// ── Brand palette ──────────────────────────────────────────────
const G      = "#2E8B7F";
const G_LIGHT = "#e8f5f3";
const G_MID   = "#5AADA3";
const G_DARK  = "#1f6259";

// ── Data ───────────────────────────────────────────────────────
const appointmentData = [
  { month: "Jan", confirmed: 58,  completed: 52,  cancelled: 6  },
  { month: "Fév", confirmed: 72,  completed: 65,  cancelled: 7  },
  { month: "Mar", confirmed: 80,  completed: 74,  cancelled: 8  },
  { month: "Avr", confirmed: 95,  completed: 88,  cancelled: 9  },
  { month: "Mai", confirmed: 108, completed: 100, cancelled: 10 },
  { month: "Jun", confirmed: 102, completed: 95,  cancelled: 9  },
  { month: "Jul", confirmed: 97,  completed: 90,  cancelled: 8  },
  { month: "Aoû", confirmed: 88,  completed: 80,  cancelled: 9  },
  { month: "Sep", confirmed: 110, completed: 102, cancelled: 10 },
  { month: "Oct", confirmed: 125, completed: 117, cancelled: 11 },
  { month: "Nov", confirmed: 130, completed: 121, cancelled: 11 },
  { month: "Déc", confirmed: 140, completed: 130, cancelled: 12 },
];

const revenueData = [
  { month: "Jul", revenus: 19500, depenses: 1200 },
  { month: "Aoû", revenus: 17000, depenses: 980  },
  { month: "Sep", revenus: 19800, depenses: 1100 },
  { month: "Oct", revenus: 22500, depenses: 1350 },
  { month: "Nov", revenus: 20000, depenses: 1200 },
  { month: "Déc", revenus: 25800, depenses: 1500 },
];

const todayAppointments = [
  { id: 1, name: "Sophie Martin",  type: "Consultation",  doctor: "Dr. Dupont",  time: "09:00", status: "Confirmé"    },
  { id: 2, name: "Marc Leblanc",   type: "Bilan sanguin", doctor: "Dr. Bernard", time: "10:30", status: "En attente"  },
  { id: 3, name: "Claire Moreau",  type: "Suivi",         doctor: "Dr. Dupont",  time: "11:00", status: "Terminé"     },
  { id: 4, name: "Pierre Garnier", type: "Consultation",  doctor: "Dr. Petit",   time: "14:00", status: "Annulé"      },
  { id: 5, name: "Alice Fontaine", type: "Vaccination",   doctor: "Dr. Bernard", time: "15:30", status: "Confirmé"    },
];

const typeIcons = {
  Consultation:  <Stethoscope size={13} />,
  "Bilan sanguin": <FlaskConical size={13} />,
  Suivi:         <HeartPulse size={13} />,
  Vaccination:   <Syringe size={13} />,
};

const statusConfig = {
  Confirmé:     { bg: G_LIGHT,   color: G,        icon: <CheckCircle2 size={12} /> },
  "En attente": { bg: "#fff8e6", color: "#c47f00", icon: <AlertCircle  size={12} /> },
  Terminé:      { bg: "#eef0ff", color: "#4f6ef7", icon: <CheckCircle2 size={12} /> },
  Annulé:       { bg: "#fff0f2", color: "#d93050", icon: <Ban          size={12} /> },
};

// ── Custom tooltip ─────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: "10px 16px",
      boxShadow: "0 6px 24px rgba(0,0,0,0.12)", fontSize: 13, minWidth: 140,
    }}>
      <div style={{ fontWeight: 700, color: "#16302b", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "#666" }}>{p.name}:</span>
          <strong style={{ color: "#16302b" }}>
            {typeof p.value === "number" && p.value > 1000 ? `${p.value.toLocaleString()} MAD` : p.value}
          </strong>
        </div>
      ))}
    </div>
  );
};

// ── Stat card ──────────────────────────────────────────────────
const StatCard = ({ Icon, iconBg, value, label, change, positive }) => (
  <div style={{
    background: "#fff", borderRadius: 18, padding: "22px 24px",
    flex: 1, minWidth: 180,
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    display: "flex", flexDirection: "column", gap: 14,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{
        background: iconBg || G_LIGHT,
        borderRadius: 12, width: 42, height: 42,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: positive ? G : "#d93050",
      }}>
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <span style={{
        fontSize: 12, fontWeight: 700,
        color: positive ? G : "#d93050",
        background: positive ? G_LIGHT : "#fff0f2",
        padding: "3px 10px", borderRadius: 20,
        display: "flex", alignItems: "center", gap: 4,
      }}>
        <TrendingUp size={11} style={{ transform: positive ? "none" : "scaleY(-1)" }} />
        {change}
      </span>
    </div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#16302b", letterSpacing: "-0.5px" }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: "#8aada8", marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

// ── Main ───────────────────────────────────────────────────────
export default function dashboard() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#f3f7f6",
      minHeight: "100vh",
      padding: "0 0 48px",
    }}>

      {/* ── Header banner ── */}
      <div style={{
        background: `linear-gradient(135deg, ${G} 0%, ${G_DARK} 100%)`,
        borderRadius: 22,
        margin: "20px 24px 0",
        padding: "26px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: `0 6px 28px ${G}55`,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative rings */}
        <div style={{
          position: "absolute", right: -60, top: -60,
          width: 220, height: 220,
          border: "40px solid rgba(255,255,255,0.07)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", right: 140, bottom: -80,
          width: 160, height: 160,
          border: "28px solid rgba(255,255,255,0.05)",
          borderRadius: "50%",
        }} />

        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
            Bonjour, Dr. Martin 👋
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.72)" }}>
            Vous avez <strong style={{ color: "#fff" }}>8 rendez-vous</strong> aujourd'hui
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, position: "relative" }}>
          {[
            { count: 8, label: "Aujourd'hui", active: true  },
            { count: 3, label: "En attente",  active: false },
          ].map((item) => (
            <div key={item.label} style={{
              background: item.active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
              border: `1px solid ${item.active ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 16, padding: "14px 22px",
              textAlign: "center", minWidth: 86, cursor: "pointer",
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{item.count}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "flex", gap: 16, margin: "20px 24px", flexWrap: "wrap" }}>
        <StatCard Icon={Users}         value="1 284"    label="Total Patients"    change="+12.5%" positive />
        <StatCard Icon={CalendarCheck} value="140"      label="RDV ce mois"       change="+8.2%"  positive />
        <StatCard Icon={Wallet}        value="24 600 MAD" label="Revenus mensuels"  change="+14.1%" positive />
        <StatCard Icon={XCircle}       iconBg="#fff0f2" value="9.3%"  label="Taux d'annulation" change="-2.4%" positive={false} />
      </div>

      {/* ── Charts ── */}
      <div style={{ display: "flex", gap: 16, margin: "0 24px", flexWrap: "wrap" }}>

        {/* Area chart */}
        <div style={{
          background: "#fff", borderRadius: 18, padding: "24px 28px",
          flex: "2 1 460px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#16302b" }}>Rendez-vous annuels</div>
              <div style={{ fontSize: 12, color: "#8aada8", marginTop: 2 }}>Confirmés, complétés et annulés</div>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: G_LIGHT, borderRadius: 10,
              padding: "6px 13px", fontSize: 13, color: G, fontWeight: 700,
            }}>
              <Activity size={14} /> 2026
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={appointmentData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gConf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={G}     stopOpacity={0.18} />
                  <stop offset="95%" stopColor={G}     stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gComp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={G_MID} stopOpacity={0.14} />
                  <stop offset="95%" stopColor={G_MID} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#edf2f1" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8aada8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8aada8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(v) => v === "confirmed" ? "Confirmés" : v === "completed" ? "Complétés" : "Annulés"} />
              <Area type="monotone" dataKey="confirmed" stroke={G}      strokeWidth={2.5} fill="url(#gConf)" dot={false} name="confirmed" />
              <Area type="monotone" dataKey="completed" stroke={G_MID}  strokeWidth={2}   fill="url(#gComp)" dot={false} name="completed" />
              <Line type="monotone" dataKey="cancelled" stroke="#e05070" strokeWidth={1.5} strokeDasharray="5 4" dot={false} name="cancelled" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div style={{
          background: "#fff", borderRadius: 18, padding: "24px 28px",
          flex: "1 1 280px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <Wallet size={16} color={G} strokeWidth={2} />
            <span style={{ fontSize: 16, fontWeight: 700, color: "#16302b" }}>Revenus & Dépenses</span>
          </div>
          <div style={{ fontSize: 12, color: "#8aada8", marginBottom: 16, marginLeft: 24 }}>Vue mensuelle</div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={16} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#edf2f1" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8aada8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8aada8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(v) => v === "revenus" ? "Revenus" : "Dépenses"} />
              <Bar dataKey="revenus"  fill={G}      radius={[6, 6, 0, 0]} name="revenus"  />
              <Bar dataKey="depenses" fill="#b2d8d4" radius={[6, 6, 0, 0]} name="depenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Appointments list ── */}
      <div style={{
        background: "#fff", borderRadius: 18,
        margin: "20px 24px 0", padding: "24px 28px",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CalendarCheck size={18} color={G} strokeWidth={2} />
              <span style={{ fontSize: 16, fontWeight: 700, color: "#16302b" }}>Rendez-vous du jour</span>
            </div>
            <div style={{ fontSize: 12, color: "#8aada8", marginTop: 3, marginLeft: 26 }}>Mardi 3 mars 2026</div>
          </div>
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            color: G, fontSize: 13, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 3,
          }}>
            Voir tout <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {todayAppointments.map((appt) => {
            const s   = statusConfig[appt.status];
            const isH = hovered === appt.id;
            return (
              <div
                key={appt.id}
                onMouseEnter={() => setHovered(appt.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", alignItems: "center",
                  padding: "13px 16px", borderRadius: 14,
                  background: isH ? G_LIGHT : "#fafcfb",
                  border: `1px solid ${isH ? G + "28" : "transparent"}`,
                  transition: "all 0.18s", cursor: "pointer",
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${G}, ${G_MID})`,
                  color: "#fff", fontWeight: 800, fontSize: 15,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginRight: 14,
                  boxShadow: `0 3px 10px ${G}40`,
                }}>
                  {appt.name[0]}
                </div>

                {/* Name + type */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#16302b" }}>{appt.name}</div>
                  <div style={{
                    fontSize: 12, color: "#8aada8", marginTop: 2,
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    <span style={{ color: G }}>{typeIcons[appt.type]}</span>
                    {appt.type} · {appt.doctor}
                  </div>
                </div>

                {/* Time */}
                <div style={{
                  fontSize: 13, color: "#7a9e98", marginRight: 20,
                  display: "flex", alignItems: "center", gap: 5, fontWeight: 500,
                }}>
                  <Clock size={13} color="#8aada8" /> {appt.time}
                </div>

                {/* Status badge */}
                <div style={{
                  background: s.bg, color: s.color,
                  borderRadius: 20, padding: "4px 12px",
                  fontSize: 12, fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 5,
                  whiteSpace: "nowrap",
                }}>
                  {s.icon} {appt.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}