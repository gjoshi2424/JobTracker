import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { getApplicationById, updateApplication, deleteApplication } from '../services/api';
import { type Application, ApplicationStatus } from '../types';
import { LoadingSpinner } from '../components';

export default function ApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit states
  const [status, setStatus] = useState<ApplicationStatus>(ApplicationStatus.APPLIED);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) fetchApplication(id);
  }, [id]);

  const fetchApplication = async (appId: string) => {
    try {
      const data = await getApplicationById(appId);
      setApplication(data);
      setStatus(data.status);
      setNotes(data.notes || '');
    } catch (error) {
      console.error('Failed to fetch application', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const updated = await updateApplication(id, { status, notes });
      setApplication(updated);
      navigate('/');
    } catch (error) {
      console.error('Failed to update application', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(id);
        navigate('/');
      } catch (error) {
        console.error('Failed to delete application', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-800">Application not found</h2>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4">
        <Link to="/" className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 flex-1">Application Details</h1>
        <button
          onClick={handleDelete}
          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500">Company</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{application.company}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Role</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{application.role}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Date Applied</p>
              <p className="text-lg text-slate-900 mt-1">{new Date(application.dateApplied).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow cursor-pointer"
              >
                {Object.values(ApplicationStatus).map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <label className="block text-sm font-medium text-slate-500 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-y"
              placeholder="Add your notes about the interview, company, etc..."
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
