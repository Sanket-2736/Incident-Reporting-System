import React from "react";
import { Link } from "react-router-dom";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { useAuthStore } from "../../stores/authStore";
import { motion } from "framer-motion"; // Import motion

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Home = () => {
  const { authUser, authRole } = useAuthStore();
  const pieData = {
    labels: ["Solved Cases", "In Progress", "Unresolved"],
    datasets: [
      {
        data: [70, 20, 10],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
        hoverBackgroundColor: ["#388e3c", "#f57c00", "#d32f2f"],
      },
    ],
  };

  const lineData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Cases Reported",
        data: [40, 55, 60, 80, 100, 90, 120],
        fill: true,
        borderColor: "#2196f3",
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center px-4 py-8">
      {/* Header Section */}
      <motion.header
        className="max-w-4xl text-center mb-12"
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Incident Reporter</h1>
        <p className="text-lg text-gray-600">
          Track and manage incidents seamlessly. Real-time updates, case tracking, and user insights all in one place.
        </p>
        <div className="flex justify-center mt-6 space-x-4">
          <Link to="/report" className="btn btn-primary px-6 py-3 text-lg font-medium">
            Report Incidents
          </Link>
          {!authUser && (
            <Link to="/login" className="btn btn-outline px-6 py-3 text-lg font-medium">
              Log In
            </Link>
          )}
          {authUser && (
            <Link to="/incidents" className="btn btn-error px-6 py-3 text-lg font-medium">
              View Incidents
            </Link>
          )}
          {authUser && (
            <Link to="/view-registrations" className="btn btn-success px-6 py-3 text-lg font-medium">
              View Registrations
            </Link>
          )}
        </div>
      </motion.header>

      {/* Overview and Graphs Section */}
      <motion.section
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="bg-white shadow-md rounded-lg p-6 text-center" variants={variants}>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Overview</h2>
          <div className="flex justify-around mb-4">
            <div>
              <h3 className="text-3xl font-bold text-green-600">1200</h3>
              <p className="text-gray-600">Cases Solved</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-yellow-600">300</h3>
              <p className="text-gray-600">In Progress</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-red-600">50</h3>
              <p className="text-gray-600">Unresolved</p>
            </div>
          </div>
          <Pie data={pieData} />
        </motion.div>

        <motion.div className="bg-white shadow-md rounded-lg p-6 text-center" variants={variants}>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Case Trends</h2>
          <Line data={lineData} />
        </motion.div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="mt-12 w-full max-w-6xl text-center"
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div className="bg-white shadow-md rounded-lg p-6" variants={variants}>
            <p className="italic text-gray-600">
              "Incident Reporter has made reporting issues so much easier. The real-time updates are a game changer!"
            </p>
            <h3 className="text-lg font-bold text-gray-800 mt-4">- Priya Sharma</h3>
          </motion.div>
          <motion.div className="bg-white shadow-md rounded-lg p-6" variants={variants}>
            <p className="italic text-gray-600">
              "Thanks to this app, our community has resolved incidents much faster than before."
            </p>
            <h3 className="text-lg font-bold text-gray-800 mt-4">- Alex John</h3>
          </motion.div>
          <motion.div className="bg-white shadow-md rounded-lg p-6" variants={variants}>
            <p className="italic text-gray-600">
              "The data visualization tools are fantastic. It helps us see trends and improve our processes."
            </p>
            <h3 className="text-lg font-bold text-gray-800 mt-4">- Sneha Patel</h3>
          </motion.div>
        </div>
      </motion.section>

      {/* Upcoming Features Section */}
      <motion.section
        className="mt-12 w-full max-w-6xl text-center"
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Upcoming Features</h2>
        <ul className="list-disc list-inside text-left mx-auto max-w-3xl text-lg text-gray-600">
          <li>AI-powered incident categorization and prioritization</li>
          <li>Enhanced reporting for detailed case analytics</li>
          <li>Integration with popular communication platforms like Slack</li>
          <li>Mobile app for on-the-go incident reporting</li>
        </ul>
      </motion.section>

      {/* Impact Section */}
      <motion.section
        className="mt-12 text-center"
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Impact</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Since our inception, Incident Reporter has helped over 10,000 users report and resolve cases efficiently. Our platform fosters community collaboration and transparency.
        </p>
      </motion.section>
    </div>
  );
};

export default Home;
