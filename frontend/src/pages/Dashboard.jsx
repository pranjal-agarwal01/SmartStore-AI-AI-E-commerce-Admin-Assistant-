import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { FiBox, FiDollarSign, FiShoppingCart, FiAlertTriangle } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, suggestionsRes] = await Promise.all([
        axios.get('/api/sales/dashboard'),
        axios.get('/api/ai/suggestions'),
      ]);
      setStats(statsRes.data);
      setSuggestions(suggestionsRes.data.suggestions);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: FiBox, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: FiDollarSign, color: 'bg-green-500' },
    { label: 'Total Sales', value: stats?.totalSales || 0, icon: FiShoppingCart, color: 'bg-purple-500' },
    { label: 'Low Stock Alerts', value: stats?.lowStockCount || 0, icon: FiAlertTriangle, color: 'bg-red-500' },
  ];

  const revenueChartData = {
    labels: stats?.last7Days?.map(d => d.date) || [],
    datasets: [
      {
        label: 'Revenue ($)',
        data: stats?.last7Days?.map(d => d.revenue) || [],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryLabels = Object.keys(stats?.categoryRevenue || {});
  const categoryData = Object.values(stats?.categoryRevenue || {});
  const categoryChartData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryData,
        backgroundColor: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
      },
    ],
  };

  const topProductsData = {
    labels: stats?.topProducts?.map(p => p.name) || [],
    datasets: [
      {
        label: 'Units Sold',
        data: stats?.topProducts?.map(p => p.salesCount) || [],
        backgroundColor: '#6366f1',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className={`${card.color} p-3 rounded-lg text-white`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Revenue (Last 7 Days)</h3>
          <Line data={revenueChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Revenue by Category</h3>
          {categoryLabels.length > 0 ? (
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Doughnut data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-12">No category data yet</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          {stats?.topProducts?.length > 0 ? (
            <Bar data={topProductsData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
          ) : (
            <p className="text-gray-400 text-center py-12">No sales data yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">AI Suggestions</h3>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="p-3 bg-indigo-50 rounded-lg text-sm text-gray-700">
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {stats?.lowStockProducts?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-red-700 mb-3">Low Stock Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stats.lowStockProducts.map((p, i) => (
              <div key={i} className="bg-white rounded-lg p-3 flex justify-between items-center">
                <span className="font-medium text-gray-700">{p.name}</span>
                <span className="text-red-600 font-bold">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
