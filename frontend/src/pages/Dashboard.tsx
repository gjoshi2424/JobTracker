import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { getApplications, createApplication, deleteApplication } from '../services/api';
import { type Application, ApplicationStatus, type CreateApplicationDTO } from '../types';

const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ApplicationStatus.RECRUITER_SCREEN]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ApplicationStatus.INTERVIEW]: 'bg-amber-100 text-amber-800 border-amber-200',
  [ApplicationStatus.OFFER]: 'bg-green-100 text-green-800 border-green-200',
  [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200',
};

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New application form state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newApp: CreateApplicationDTO = {
        company,
        role,
        status: ApplicationStatus.APPLIED,
        dateApplied: new Date().toISOString(),
      };
      await createApplication(newApp);
      setCompany('');
      setRole('');
      setIsModalOpen(false);
      fetchApplications();
    } catch (error) {
      console.error('Failed to create application', error);
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

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
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

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-slate-900">Recent Applications</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Application</span>
        </button>
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[app.status]}`}>
                          {app.status.replace('_', ' ')}
                        </span>
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

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Add Application</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
