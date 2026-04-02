import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const ChartRevenusDepenses = () => {
  const data = [
    { mois: "Jul", revenus: 108, depenses: 75 },
    { mois: "Aoû", revenus: 75, depenses: 60 },
    { mois: "Sep", revenus: 85, depenses: 72 },
    { mois: "Oct", revenus: 110, depenses: 85 },
    { mois: "Nov", revenus: 110, depenses: 108 },
    { mois: "Déc", revenus: 142, depenses: 118 },
  ];

  return (
    <div className="card-container-bar">
      <div className="card-header-bar">
        <h2 className="card-title-bar">Revenus & Dépenses</h2>
        <p className="card-subtitle-bar">Vue mensuelle</p>
      </div>

      <BarChart
        className="bar-chart-container"
        width="100%"
        height={300}
        data={data}
      >
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
        />
        <Tooltip />
        <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 10 }}
        />
        <Bar
          dataKey="revenus"
          fill="#2b8074"
          name="Revenus"
          barSize={10}
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="depenses"
          fill="rgba(43,128,116,0.1)"
          name="Dépenses"
          barSize={10}
          radius={[10, 10, 0, 0]}
        />
      </BarChart>
    </div>
  );
};

export default ChartRevenusDepenses;
