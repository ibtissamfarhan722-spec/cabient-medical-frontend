import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { RiPulseLine } from "react-icons/ri";
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border-gray-400 rounded-xl px-4 py-4">
      <p className="font-bold mb-3">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color, margin: "2px 0" }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const ChartRendezVousAnnuels = () => {
  const data = [
    { mois: "Jan", confirmes: 70, completes: 38, annules: 14 },
    { mois: "Fév", confirmes: 88, completes: 52, annules: 12 },
    { mois: "Mar", confirmes: 93, completes: 65, annules: 11 },
    { mois: "Avr", confirmes: 100, completes: 75, annules: 16 },
    { mois: "Mai", confirmes: 105, completes: 80, annules: 22 },
    { mois: "Jun", confirmes: 105, completes: 85, annules: 14 },
    { mois: "Jul", confirmes: 108, completes: 75, annules: 15 },
    { mois: "Aoû", confirmes: 75, completes: 60, annules: 15 },
    { mois: "Sep", confirmes: 85, completes: 72, annules: 14 },
    { mois: "Oct", confirmes: 110, completes: 85, annules: 19 },
    { mois: "Nov", confirmes: 110, completes: 108, annules: 14 },
    { mois: "Déc", confirmes: 142, completes: 118, annules: 14 },
  ];

  return (
    <div className="card-container">
      <div className="card-header">
        <div>
          <h2 className="card-title">Rendez-vous annuels</h2>
          <p className="card-subtitle">Confirmés, complétés et annulés</p>
        </div>
        <span className="card-badge">
          <RiPulseLine />
          2026
        </span>
      </div>
      <ResponsiveContainer className="card-chart" width="100%" height={280}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradConfirmes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2b8074" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2b8074" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradCompletes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2b8074" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#2b8074" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="mois"
            tick={{ fontSize: 12, fill: "#888" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#888" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 150]}
          />
          <Tooltip content={<CustomTooltip className="custom-tooltip" />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 10 }}
          />
          <Area
            type="monotone"
            dataKey="confirmes"
            name="Confirmés"
            stroke="#1D9E75"
            strokeWidth={2}
            fill="url(#gradConfirmes)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="completes"
            name="Complétés"
            stroke="#5DCAA5"
            strokeWidth={2}
            fill="url(#gradCompletes)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="annules"
            name="Annulés"
            stroke="#E24B4A"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            fill="none"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartRendezVousAnnuels;
