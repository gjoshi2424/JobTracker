export const ApplicationStatus = {
  APPLIED: 'APPLIED',
  RECRUITER_SCREEN: 'RECRUITER_SCREEN',
  INTERVIEW: 'INTERVIEW',
  OFFER: 'OFFER',
  REJECTED: 'REJECTED'
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

export interface Application {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  dateApplied: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationDTO {
  company: string;
  role: string;
  status?: ApplicationStatus;
  dateApplied: string;
  notes?: string;
}

export interface UpdateApplicationDTO {
  company?: string;
  role?: string;
  status?: ApplicationStatus;
  dateApplied?: string;
  notes?: string;
}
