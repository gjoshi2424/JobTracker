import { ApplicationStatus } from '../types';

const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ApplicationStatus.RECRUITER_SCREEN]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ApplicationStatus.INTERVIEW]: 'bg-amber-100 text-amber-800 border-amber-200',
  [ApplicationStatus.OFFER]: 'bg-green-100 text-green-800 border-green-200',
  [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200',
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
