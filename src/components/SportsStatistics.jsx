import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const SportsStatistics = () => {
  const [activeTab, setActiveTab] = useState("participation");
  const [animateCharts, setAnimateCharts] = useState(false);

  // Simulated data for sports participation
  const participationData = [
    { name: "Cricket", students: 120, fill: "#8884d8" },
    { name: "Football", students: 98, fill: "#82ca9d" },
    { name: "Basketball", students: 86, fill: "#ffc658" },
    { name: "Swimming", students: 72, fill: "#ff8042" },
    { name: "Athletics", students: 65, fill: "#0088fe" },
    { name: "Badminton", students: 53, fill: "#00C49F" },
  ];

  // Simulated data for achievements
  const achievementsData = [
    { name: "Gold", value: 45, color: "#FFD700" },
    { name: "Silver", value: 30, color: "#C0C0C0" },
    { name: "Bronze", value: 25, color: "#CD7F32" },
  ];

  // Trigger animation when component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateCharts(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("sports-statistics");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-indigo-600">
            {`${payload[0].value} students`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section 
      id="sports-statistics" 
      className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sports Analytics
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the data behind our sports programs and achievements
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("participation")}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === "participation"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Participation
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === "achievements"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Achievements
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={animateCharts ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="h-80 md:h-96"
          >
            {activeTab === "participation" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={participationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#4B5563' }}
                    tickLine={{ stroke: '#9CA3AF' }}
                    axisLine={{ stroke: '#D1D5DB' }}
                  />
                  <YAxis 
                    tick={{ fill: '#4B5563' }}
                    tickLine={{ stroke: '#9CA3AF' }}
                    axisLine={{ stroke: '#D1D5DB' }}
                    label={{ 
                      value: 'Number of Students', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: '#4B5563' }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="students" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationBegin={animateCharts ? 0 : 9999}
                  >
                    {participationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={achievementsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1500}
                    animationBegin={animateCharts ? 0 : 9999}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {achievementsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} medals`, 'Count']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Legend for pie chart */}
          {activeTab === "achievements" && (
            <div className="flex justify-center mt-6 space-x-8">
              {achievementsData.map((entry) => (
                <div key={entry.name} className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-700">{entry.name}: {entry.value} medals</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={animateCharts ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 text-center"
          >
            <div className="text-4xl font-bold text-indigo-600 mb-2">15+</div>
            <div className="text-gray-700">Sports Offered</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={animateCharts ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 text-center"
          >
            <div className="text-4xl font-bold text-indigo-600 mb-2">85%</div>
            <div className="text-gray-700">Student Participation</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={animateCharts ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 text-center"
          >
            <div className="text-4xl font-bold text-indigo-600 mb-2">24</div>
            <div className="text-gray-700">Annual Tournaments</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SportsStatistics;