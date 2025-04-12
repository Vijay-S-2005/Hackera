"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ParkingLot() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParkingInfo = async () => {
      try {
        const response = await fetch("/api/getParkingInfo");
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          // Get the most recent entry
          const latestData = result.data[result.data.length - 1];

          if (latestData.area_status) {
            // Convert the area_status object to an array of slot objects
            const slotsArray = Object.entries(latestData.area_status).map(
              ([name, isOccupied], index) => ({
                id: index + 1,
                name: name,
                status: isOccupied ? "occupied" : "vacant",
              })
            );

            setSlots(slotsArray);
          }
        }
      } catch (error) {
        console.error("Error fetching parking info:", error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchParkingInfo();

    // Set up polling interval to update slots every 3 seconds
    const intervalId = setInterval(fetchParkingInfo, 3000);

    // Clean up interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-6">
      {/* Navigation Bar */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 rounded-2xl shadow-lg p-6 mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          Smart Parking - Parking Lot
        </h1>
        <nav className="flex gap-4">
          <Link
            href="/dashboard"
            className="text-white text-lg font-semibold hover:underline"
          >
            Dashboard
          </Link>
          <Link
            href="/parkingLot"
            className="text-white text-lg font-semibold hover:underline"
          >
            Parking Lot
          </Link>
          <Link
            href="/parkingFee"
            className="text-white text-lg font-semibold hover:underline"
          >
            Parking Fee
          </Link>
          <Link
            href="/problemStatement"
            className="text-white text-lg font-semibold hover:underline"
          >
            Our Problem
          </Link>
          <Link
            href="/profile"
            className="text-white text-lg font-semibold hover:underline"
          >
            Profile
          </Link>
        </nav>
      </div>

      {/* Parking Box */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Parking Slots</h2>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`relative p-4 rounded-xl shadow-md flex items-center justify-center h-24 w-full border-4 
                  ${
                    slot.status === "occupied"
                      ? "border-red-500 animate-pulse"
                      : "border-green-500 animate-fadeIn"
                  }
                  transition-all duration-500 ease-in-out`}
              >
                <span className="text-lg font-semibold text-gray-700">
                  {slot.name}
                </span>
                <span
                  className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded 
                    ${
                      slot.status === "occupied"
                        ? "bg-red-200 text-red-800"
                        : "bg-green-200 text-green-800"
                    }`}
                >
                  {slot.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
