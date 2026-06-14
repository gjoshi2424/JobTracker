import axios from 'axios';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../services/api';
import { ApplicationStatus } from '../types';
import type { Application } from '../types';

// Mock axios so no real HTTP requests are made
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

const mockApplication: Application = {
  id: '1',
  company: 'Acme Corp',
  role: 'Frontend Engineer',
  status: ApplicationStatus.APPLIED,
  dateApplied: '2024-01-15',
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
};

// ── getApplications ────────────────────────────────────────────────────────────

describe('getApplications', () => {
  it('returns an array of applications on success', async () => {
    mockAxios.get.mockResolvedValue({ data: [mockApplication] });

    const result = await getApplications();

    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:3000/applications');
    expect(result).toEqual([mockApplication]);
  });

  it('propagates errors from axios', async () => {
    mockAxios.get.mockRejectedValue(new Error('Network Error'));

    await expect(getApplications()).rejects.toThrow('Network Error');
  });
});

// ── getApplicationById ─────────────────────────────────────────────────────────

describe('getApplicationById', () => {
  it('calls the correct endpoint and returns the application', async () => {
    mockAxios.get.mockResolvedValue({ data: mockApplication });

    const result = await getApplicationById('1');

    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:3000/applications/1');
    expect(result).toEqual(mockApplication);
  });
});

// ── createApplication ──────────────────────────────────────────────────────────

describe('createApplication', () => {
  it('posts to the correct endpoint and returns the created application', async () => {
    mockAxios.post.mockResolvedValue({ data: mockApplication });

    const payload = { company: 'Acme Corp', role: 'Frontend Engineer', dateApplied: '2024-01-15' };
    const result = await createApplication(payload);

    expect(mockAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000/applications',
      payload
    );
    expect(result).toEqual(mockApplication);
  });
});

// ── updateApplication ──────────────────────────────────────────────────────────

describe('updateApplication', () => {
  it('sends a PATCH to the correct endpoint with the update payload', async () => {
    const updated = { ...mockApplication, status: ApplicationStatus.INTERVIEW };
    mockAxios.patch.mockResolvedValue({ data: updated });

    const result = await updateApplication('1', { status: ApplicationStatus.INTERVIEW });

    expect(mockAxios.patch).toHaveBeenCalledWith(
      'http://localhost:3000/applications/1',
      { status: ApplicationStatus.INTERVIEW }
    );
    expect(result.status).toBe(ApplicationStatus.INTERVIEW);
  });
});

// ── deleteApplication ──────────────────────────────────────────────────────────

describe('deleteApplication', () => {
  it('sends a DELETE to the correct endpoint', async () => {
    mockAxios.delete.mockResolvedValue({ data: undefined });

    await deleteApplication('1');

    expect(mockAxios.delete).toHaveBeenCalledWith('http://localhost:3000/applications/1');
  });

  it('propagates errors from axios', async () => {
    mockAxios.delete.mockRejectedValue(new Error('Not Found'));

    await expect(deleteApplication('999')).rejects.toThrow('Not Found');
  });
});
