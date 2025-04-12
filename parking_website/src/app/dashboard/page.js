"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const PIE_COLORS = ["#a3a3a3", "#3b82f6"]; // Gray and Blue for vacant
const COLORS = ["#7e22ce"]; // Purple

export default function Dashboard() {
  const [apiData, setApiData] = useState([]); // eslint-disable-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [todayMoney, setTodayMoney] = useState(0);
  const [weeklyMoney, setWeeklyMoney] = useState(0);
  const [carCount, setCarCount] = useState(0);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([{ name: "Car", value: 0 }]);
  const [vacantData, setVacantData] = useState([
    { name: "Vacant", value: 0 },
    { name: "Occupied", value: 0 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getData");
        const result = await response.json();
        setApiData(result.data);
        processData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchParkingInfo = async () => {
      try {
        const response = await fetch("/api/getParkingInfo");
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          const latestData = result.data[result.data.length - 1];

          setVacantData([
            { name: "Vacant", value: latestData.vacancy || 0 },
            { name: "Occupied", value: latestData.occupied || 0 },
          ]);

          setCarCount(latestData.occupied || 0);
        }
      } catch (error) {
        console.error("Error fetching parking info:", error);
      }
    };

    fetchParkingInfo();

    const intervalId = setInterval(fetchParkingInfo, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const processData = (data) => {
    if (!data || data.length === 0) return;

    const today = new Date().toISOString().split("T")[0];
    const todayEntries = data.filter((item) => {
      const entryDate = item.entry_timestamp.split(" ")[0];
      return entryDate === today;
    });

    const todayTotal = todayEntries.reduce(
      (sum, item) => sum + (item.cost || 0),
      0
    );
    setTodayMoney(todayTotal);

    const weeklyTotal = data.reduce((sum, item) => sum + (item.cost || 0), 0);
    setWeeklyMoney(weeklyTotal);

    if (data.length > 0) {
      setCarCount(data[data.length - 1]?.occupied || 0);
    }

    setPieData([{ name: "Car", value: data[data.length - 1]?.occupied || 0 }]);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayMap = {};

    data.forEach((item) => {
      if (item.entry_timestamp) {
        const date = new Date(item.entry_timestamp.split(" ")[0]);
        const day = days[date.getDay()];

        if (!dayMap[day]) {
          dayMap[day] = 0;
        }
        dayMap[day] += 1;
      }
    });

    const barChartData = days.map((day) => ({
      day,
      Car: dayMap[day] || 0,
    }));

    setBarData(barChartData);

    const entriesByHour = {};

    data.forEach((item) => {
      if (item.entry_timestamp) {
        const hour = item.entry_timestamp.split(" ")[1].substring(0, 5);
        if (!entriesByHour[hour]) {
          entriesByHour[hour] = 0;
        }
        entriesByHour[hour] += 1;
      }
    });

    const hourlyData = Object.keys(entriesByHour).map((hour) => ({
      time: hour,
      Car: entriesByHour[hour],
    }));

    hourlyData.sort((a, b) => a.time.localeCompare(b.time));

    setLineData(hourlyData);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-6">
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 rounded-2xl shadow-lg p-6 mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          Smart Parking Dashboard
        </h1>
        <nav className="flex gap-4">
          <a
            href="/dashboard"
            className="text-white text-lg font-semibold hover:underline"
          >
            Dashboard
          </a>
          <a
            href="/parkingLot"
            className="text-white text-lg font-semibold hover:underline"
          >
            Parking lot
          </a>
          <a
            href="/parkingFee"
            className="text-white text-lg font-semibold hover:underline"
          >
            Parking Fee
          </a>
          <a
            href="/problemStatement"
            className="text-white text-lg font-semibold hover:underline"
          >
            Our problem
          </a>
          <a
            href="/profile"
            className="text-white text-lg font-semibold hover:underline"
          >
            Profile
          </a>
        </nav>
      </div>

      <div className="flex gap-4">
        <div className="bg-white shadow-md rounded-2xl p-4 w-1/5">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">
            TOTAL MONEY COLLECTION (inr)
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-xl text-center shadow-inner">
              <p className="text-xs text-gray-500">TODAY</p>
              <p className="text-xl font-bold">₹{todayMoney}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl text-center shadow-inner">
              <p className="text-xs text-gray-500">THIS WEEK</p>
              <p className="text-xl font-bold">₹{weeklyMoney}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-700 rounded-2xl w-3/5 shadow-md flex items-center justify-center text-white text-lg font-semibold">
          <p>{loading ? "Loading data..." : "Smart Parking Status Overview"}</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4 w-1/5 flex flex-col items-center">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">
            VEHICLE COUNT
          </h2>
          <div className="flex justify-center mb-4">
            <div className="bg-purple-700 text-white rounded-xl px-4 py-2 text-center shadow">
              <p className="text-xs">CAR</p>
              <p className="text-lg font-bold">{carCount}</p>
            </div>
          </div>

          <PieChart width={160} height={160}>
            <Pie
              data={pieData}
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="bg-white shadow-md rounded-2xl p-4 w-3/5">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">
            Weekly Car Entry Count
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Car" fill="#7e22ce" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4 w-2/5 flex flex-col items-center">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">
            Parking Slot Status
          </h2>
          <PieChart width={200} height={200}>
            <Pie
              data={vacantData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              dataKey="value"
            >
              {vacantData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
          <div className="mt-2 flex gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span> Vacant
              ({vacantData[0].value})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>{" "}
              Occupied ({vacantData[1].value})
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-4">
          Hourly Car Entry (Today)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="Car"
              stroke="#2563eb"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
