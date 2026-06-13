import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { createApplication } from '../services/api';
import { ApplicationStatus, type CreateApplicationDTO } from '../types';

export default function NewApplication() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateApplicationDTO>({
    defaultValues: {
      status: ApplicationStatus.APPLIED,
      dateApplied: new Date().toISOString().split('T')[0],
      company: '',
      role: '',
      notes: '',
    },
  });

  const onSubmit = async (data: CreateApplicationDTO) => {
    try {
      // Ensure date is stored as ISO string if needed, 
      // but API might handle 'YYYY-MM-DD' fine.
      // We will cast to a full ISO date if necessary, 
      // but the input type="date" yields YYYY-MM-DD.
      const formattedData = {
        ...data,
        dateApplied: new Date(data.dateApplied).toISOString(),
      };
      await createApplication(formattedData);
      navigate('/');
    } catch (error) {
      console.error('Failed to create application', error);
      alert('Failed to create application. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">New Application</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Company *</label>
              <input
                type="text"
                {...register('company', { required: 'Company is required' })}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
                  errors.company ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'
                }`}
                placeholder="e.g. Acme Corp"
              />
              {errors.company && (
                <p className="text-sm text-red-600">{errors.company.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Role *</label>
              <input
                type="text"
                {...register('role', { required: 'Role is required' })}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
                  errors.role ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'
                }`}
                placeholder="e.g. Software Engineer"
              />
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Status *</label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white"
              >
                {Object.values(ApplicationStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Date Applied *</label>
              <input
                type="date"
                {...register('dateApplied', { required: 'Date applied is required' })}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
                  errors.dateApplied ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'
                }`}
              />
              {errors.dateApplied && (
                <p className="text-sm text-red-600">{errors.dateApplied.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Any additional information..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
