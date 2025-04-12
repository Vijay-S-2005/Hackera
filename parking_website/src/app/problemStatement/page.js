"use client";

import {
  Brain,
  Camera,
  Clock,
  FileText,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function ProblemStatement() {
  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 rounded-2xl shadow-lg p-6 mb-4">
        <h1 className="text-4xl font-bold text-white text-center">
          Smart AI-Powered Parking System
        </h1>
        <p className="text-center text-white mt-2 text-lg">
          “An intelligent solution for effortless parking using just one camera
          and AI.”
        </p>
      </div>

      {/* Problem Statement */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-800 flex items-center">
          🚨 Problem Statement
        </h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>
            No real-time visibility into available parking spaces, causing
            delays and traffic buildup.
          </li>
          <li>Wasted time and fuel while searching for free spots.</li>
          <li>
            Manual management of parking logs and billing, leading to human
            errors.
          </li>
          <li>
            Lack of security and tracking, making it hard to trace unauthorized
            or long-duration parking.
          </li>
          <li>Congested entry/exit points during busy hours.</li>
          <li>
            Poor space optimization due to lack of intelligent monitoring.
          </li>
        </ul>
      </div>

      {/* Our Solution */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">
          💡 Our Solution
        </h2>
        <p className="mb-4 text-gray-700">
          We present a Smart Parking Management System powered by Artificial
          Intelligence and Computer Vision, operating using just one camera.
          This system reduces manpower, increases accuracy, and streamlines the
          parking experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Feature
            icon={<Camera />}
            title="Single-Camera Detection"
            text="Uses YOLO object detection to identify parked cars in real-time."
          />
          <Feature
            icon={<Clock />}
            title="Real-Time Tracking"
            text="Constant monitoring to track available and occupied spaces instantly."
          />
          <Feature
            icon={<FileText />}
            title="Auto Billing"
            text="Instantly generates parking bills based on duration, with ALPR support."
          />
          <Feature
            icon={<ShieldCheck />}
            title="Enhanced Security"
            text="Logs every vehicle’s plate and duration to ensure traceability."
          />
          <Feature
            icon={<Brain />}
            title="AI-Powered Logic"
            text="End-to-end automation reduces manual errors and improves efficiency."
          />
          <Feature
            icon={<TrendingUp />}
            title="Space Optimization"
            text="Improves layout efficiency and traffic flow with intelligent insights."
          />
        </div>
      </div>

      {/* Impact */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">🌍 Impact</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>⏱️ Saves time by guiding drivers to available spots quickly.</li>
          <li>🧾 Ensures accurate billing with automated tracking.</li>
          <li>🔒 Boosts security with full entry/exit logs.</li>
          <li>💸 Reduces human resource costs with automation.</li>
          <li>🚦 Improves traffic flow at parking entrances and exits.</li>
          <li>
            🌱 Environmentally friendly — less fuel burned searching for
            parking.
          </li>
        </ul>
      </div>

      {/* Future Scope */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          🚀 Future Scope
        </h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>📱 Mobile app for live availability and reservations.</li>
          <li>💳 QR or UPI payments for contactless billing.</li>
          <li>🌐 Cloud dashboard for real-time analytics.</li>
          <li>🔁 Support for multi-level & underground lots.</li>
          <li>
            🧠 Edge deployment on Raspberry Pi for cost-effective processing.
          </li>
          <li>🅿️ VIP and reserved parking logic with enforcement.</li>
        </ul>
      </div>

      {/* Use Cases */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">
          🎯 Use Cases
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700 text-center">
          <div>🏢 Corporate Offices</div>
          <div>🏬 Malls</div>
          <div>🏘️ Residential Areas</div>
          <div>🚙 Public Parking</div>
          <div>🏨 Hotels/Airports</div>
          <div>🏛️ Smart Cities</div>
        </div>
      </div>

      {/* Technologies */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">
          🛠️ Technologies Used
        </h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>YOLOv8 – for object detection</li>
          <li>OpenCV – for image handling</li>
          <li>ALPR – license plate reading (EasyOCR/OpenALPR)</li>
          <li>Python – core logic implementation</li>
          <li>cvzone – for visual overlays</li>
          <li>SQLite/Firebase – data storage</li>
          <li>Flask/Streamlit – optional web UI</li>
        </ul>
      </div>

      {/* Footer Demo Placeholder */}
      <div className="bg-gray-200 rounded-2xl shadow-inner p-6 text-center text-gray-600 italic">
        📸 Demo and Screenshots Coming Soon...
      </div>
    </div>
  );
}

// Feature Card Component
function Feature({ icon, title, text }) {
  return (
    <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-4 shadow-sm">
      <div className="text-purple-700">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-600 text-sm">{text}</p>
      </div>
    </div>
  );
}
