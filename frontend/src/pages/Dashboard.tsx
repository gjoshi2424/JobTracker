import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { getApplications, deleteApplication } from '../services/api';
import { type Application, ApplicationStatus } from '../types';
import { StatusBadge, LoadingSpinner } from '../components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(id);
        fetchApplications();
      } catch (error) {
        console.error('Failed to delete application', error);
      }
    }
  };

  const stats = Object.values(ApplicationStatus).reduce((acc, status) => {
    acc[status] = applications.filter((app) => app.status === status).length;
    return acc;
  }, {} as Record<ApplicationStatus, number>);

  const chartData = Object.entries(stats).map(([status, count]) => ({
    name: status.replace('_', ' '),
    count
  }));

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(stats).map(([status, count]) => (
          <div key={status} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center transition-all hover:shadow-md hover:-translate-y-1">
            <span className="text-3xl font-bold text-slate-800">{count}</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">{status.replace('_', ' ')}</span>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-80">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Application Status Overview</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-slate-900">Recent Applications</h1>
        <Link
          to="/applications/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Application</span>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                <th className="p-4 font-semibold">Company</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date Applied</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No applications found. Add one to get started!
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="p-4">
                      <Link to={`/applications/${app.id}`} className="block font-medium text-slate-900">{app.company}</Link>
                    </td>
                    <td className="p-4">
                      <Link to={`/applications/${app.id}`} className="block text-slate-600">{app.role}</Link>
                    </td>
                    <td className="p-4">
                      <Link to={`/applications/${app.id}`} className="block">
                        <StatusBadge status={app.status} />
                      </Link>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">
                      <Link to={`/applications/${app.id}`} className="block">
                        {new Date(app.dateApplied).toLocaleDateString()}
                      </Link>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => handleDelete(app.id, e)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100"
                        title="Delete Application"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}
