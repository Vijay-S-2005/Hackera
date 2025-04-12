"use client";

import { useState, useEffect } from "react";

export default function ParkingFee() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [parkingData, setParkingData] = useState(null);
  const [error, setError] = useState("");

  // Clear results when vehicle number is empty
  useEffect(() => {
    if (!vehicleNumber.trim()) {
      setParkingData(null);
      setError("");
    }
  }, [vehicleNumber]);

  const fetchParkingDetails = async () => {
    if (!vehicleNumber.trim()) {
      setParkingData(null);
      setError("Please enter a vehicle number");
      return;
    }

    try {
      const response = await fetch(
        `/api/getData?vehicleNumber=${encodeURIComponent(vehicleNumber)}`
      );
      const result = await response.json();

      if (result.data && result.data.length > 0) {
        setParkingData(result.data[0]);
        setError("");
      } else {
        setParkingData(null);
        setError("No record found for this vehicle number.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching data.");
    }
  };

  const calculateDurationAndFee = () => {
    if (!parkingData) return { durationHours: 0, cost: 0 };

    const entry = new Date(parkingData.entry_timestamp);
    const exit = new Date(parkingData.exit_timestamp);
    const durationHours = Math.ceil((exit - entry) / (1000 * 60 * 60));

    // Use the cost directly from the data if available, otherwise calculate it
    const cost = parkingData.cost || durationHours * 50;

    return { durationHours, cost };
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-6">
      {/* NavBar - same as Dashboard */}
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
            Parking Lot
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

      {/* Search Box */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Search Parking Fee by Vehicle Number
        </h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter vehicle number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={fetchParkingDetails}
            className="bg-purple-700 text-white px-6 py-3 rounded-xl hover:bg-purple-800 transition"
          >
            Search
          </button>
        </div>
        {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
      </div>

      {/* Results Box - Vertical Rectangle Layout */}
      {parkingData && (
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center border-b pb-2">
            Parking Fee Details
          </h3>
          <div className="space-y-4 text-gray-700">
            <div className="flex flex-col">
              <strong>Vehicle Number:</strong>
              <span className="ml-2">{parkingData.vehicle_number}</span>
            </div>
            <div className="flex flex-col">
              <strong>Entry Time:</strong>
              <span className="ml-2">
                {formatDateTime(parkingData.entry_timestamp)}
              </span>
            </div>
            <div className="flex flex-col">
              <strong>Exit Time:</strong>
              <span className="ml-2">
                {formatDateTime(parkingData.exit_timestamp)}
              </span>
            </div>
            <div className="flex flex-col">
              <strong>Duration:</strong>
              <span className="ml-2">
                {calculateDurationAndFee().durationHours} hours
              </span>
            </div>
            <div className="flex flex-col font-bold text-lg text-purple-700 pt-2 border-t">
              <strong>Fee:</strong>
              <span className="ml-2">₹{calculateDurationAndFee().cost}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
