import React from 'react';
import { useIssues } from '../context/IssueContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FiTrendingUp, FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const Analytics = () => {
  const { issues, engineers } = useIssues();

  // Calculate statistics
  const statusData = [
    { name: 'Open', value: issues.filter((i) => i.status === 'open').length, color: '#0066CC' },
    {
      name: 'In Progress',
      value: issues.filter((i) => i.status === 'in-progress').length,
      color: '#FFD700',
    },
    {
      name: 'On Hold',
      value: issues.filter((i) => i.status === 'on-hold').length,
      color: '#FFA500',
    },
    {
      name: 'Resolved',
      value: issues.filter((i) => i.status === 'resolved').length,
      color: '#00CC66',
    },
    {
      name: 'Closed',
      value: issues.filter((i) => i.status === 'closed').length,
      color: '#808080',
    },
  ];

  const priorityData = [
    {
      name: 'Critical',
      value: issues.filter((i) => i.priority === 'critical').length,
      color: '#E02E24',
    },
    { name: 'High', value: issues.filter((i) => i.priority === 'high').length, color: '#FFA500' },
    {
      name: 'Medium',
      value: issues.filter((i) => i.priority === 'medium').length,
      color: '#FFD700',
    },
    { name: 'Low', value: issues.filter((i) => i.priority === 'low').length, color: '#00CC66' },
  ];

  // Issues by category
  const categoryMap = {};
  issues.forEach((issue) => {
    categoryMap[issue.category] = (categoryMap[issue.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Engineer productivity
  const engineerProductivity = engineers.map((engineer) => {
    const assigned = issues.filter(
      (i) => i.assignedTo === engineer.name && (i.status === 'resolved' || i.status === 'closed')
    );
    const inProgress = issues.filter(
      (i) => i.assignedTo === engineer.name && i.status === 'in-progress'
    );
    return {
      name: engineer.name.split(' ')[1] || engineer.name,
      resolved: assigned.length,
      inProgress: inProgress.length,
    };
  });

  // SLA Performance
  const resolvedIssues = issues.filter((i) => i.status === 'resolved' || i.status === 'closed');
  const onTime = resolvedIssues.filter((issue) => {
    if (!issue.resolvedAt) return false;
    return new Date(issue.resolvedAt) <= new Date(issue.slaDeadline);
  }).length;
  const overdue = resolvedIssues.filter((issue) => {
    if (!issue.resolvedAt) return false;
    return new Date(issue.resolvedAt) > new Date(issue.slaDeadline);
  }).length;

  const slaPerformance = [
    { name: 'On Time', value: onTime, color: '#00CC66' },
    { name: 'Overdue', value: overdue, color: '#E02E24' },
  ];

  // Time-based trend (last 7 days simulation)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      created: Math.floor(Math.random() * 5),
      resolved: Math.floor(Math.random() * 4),
    };
  });

  const COLORS = ['#E02E24', '#FFA500', '#FFD700', '#00CC66', '#0066CC'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-gray-400 mt-1">System performance and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Issues"
          value={issues.length}
          icon={FiAlertTriangle}
          color="text-ranger-blue"
        />
        <MetricCard
          title="Resolved"
          value={resolvedIssues.length}
          icon={FiCheckCircle}
          color="text-ranger-green"
        />
        <MetricCard
          title="SLA Compliance"
          value={`${resolvedIssues.length > 0 ? Math.round((onTime / resolvedIssues.length) * 100) : 0}%`}
          icon={FiClock}
          color="text-ranger-yellow"
        />
        <MetricCard
          title="Active Engineers"
          value={engineers.length}
          icon={FiTrendingUp}
          color="text-morphin-time"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="ranger-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Issues by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="ranger-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Issues by Priority</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#8B00FF">
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="ranger-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Issues by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#0066CC" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SLA Performance */}
        <div className="ranger-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">SLA Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={slaPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {slaPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Engineer Productivity */}
        <div className="ranger-card p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">Engineer Productivity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engineerProductivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="resolved" fill="#00CC66" name="Resolved" />
              <Bar dataKey="inProgress" fill="#FFD700" name="In Progress" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Chart */}
        <div className="ranger-card p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">7-Day Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="created"
                stroke="#E02E24"
                strokeWidth={2}
                name="Issues Created"
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#00CC66"
                strokeWidth={2}
                name="Issues Resolved"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="ranger-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${color.replace('text-', 'bg-')}/20 rounded-lg`}>
          <Icon className={`text-2xl ${color}`} />
        </div>
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );
};

export default Analytics;
