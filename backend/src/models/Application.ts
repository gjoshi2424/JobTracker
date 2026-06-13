export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  RECRUITER_SCREEN = 'RECRUITER_SCREEN',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED'
}

export interface Application {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  dateApplied: Date;
  interviewDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApplicationDTO {
  company: string;
  role: string;
  status?: ApplicationStatus;
  dateApplied: string;
  interviewDate?: string;
  notes?: string;
}

export interface UpdateApplicationDTO {
  company?: string;
  role?: string;
  status?: ApplicationStatus;
  dateApplied?: string;
  interviewDate?: string;
  notes?: string;
}
