import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const DashboardOverviewPage = () => {
  const totalSubmissions = 1234;
  const pendingSubmissions = 125;
  const resolvedSubmissions = 1109;

  const resolutionRate = (resolvedSubmissions / totalSubmissions) * 100;
  const pendingPercentage = (pendingSubmissions / totalSubmissions) * 100;

  const submissionDataForBar = [
    { name: 'Total', value: totalSubmissions, color: '#007FFF' },
    { name: 'Pending', value: pendingSubmissions, color: '#FFD700' },
    { name: 'Resolved', value: resolvedSubmissions, color: '#32CD32' },
  ];

  const submissionDataForPie = [
    { name: 'Pending', value: pendingSubmissions, color: '#FFD700' },
    { name: 'Resolved', value: resolvedSubmissions, color: '#32CD32' },
  ];

  return (
    <div className="px-4 py-6 font-serif bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between items-start">
          <h2 className="text-xl font-semibold text-[#007FFF] mb-2">
            Total Submissions
          </h2>
          <p className="text-5xl font-bold text-[#007FFF] mb-2">
            {totalSubmissions.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">All complaints received.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between items-start">
          <h2 className="text-xl font-semibold text-[#007FFF] mb-2">
            Pending Submissions
          </h2>
          <p className="text-5xl font-bold text-[#FFD700] mb-2">
            {pendingSubmissions.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Still awaiting resolution. ({pendingPercentage.toFixed(1)}% of total)
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between items-start">
          <h2 className="text-xl font-semibold text-[#007FFF] mb-2">
            Resolved Submissions
          </h2>
          <p className="text-5xl font-bold text-[#32CD32] mb-2">
            {resolvedSubmissions.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Successfully closed. ({resolutionRate.toFixed(1)}% resolution rate)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <h2 className="text-2xl font-extrabold text-[#007FFF] mb-4">
            Submission Status Overview
          </h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={submissionDataForBar}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Legend />
                <Bar dataKey="value" name="Count">
                  {submissionDataForBar.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Visual representation of total, pending, and resolved submissions.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <h2 className="text-2xl font-extrabold text-[#007FFF] mb-4">
            Resolution Progress
          </h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={submissionDataForPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {submissionDataForPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Percentage breakdown of pending versus resolved submissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-extrabold text-[#007FFF] mb-4">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <button className="w-full bg-[#007FFF] hover:bg-[#005bb5] text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Submit New Complaint
            </button>
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View All Submissions
            </button>
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit My Profile
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-extrabold text-[#007FFF] mb-4">
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold">New Update:</p>
                <p className="text-sm">
                  Your submission #7890 has been moved to "In Progress".
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded-md flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold">Resolved:</p>
                <p className="text-sm">
                  Submission #7801 has been successfully resolved.
                </p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="font-semibold">Reminder:</p>
                <p className="text-sm">
                  Submission #7855 requires your attention.
                </p>
                <p className="text-xs text-gray-500 mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};