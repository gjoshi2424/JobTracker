import request from 'supertest';
import app from '../app';
import * as applicationService from '../services/applicationService';
import { ApplicationStatus, Application } from '../models/Application';

// Mock the entire service layer — no real DB connections in tests
jest.mock('../services/applicationService');
const mockService = applicationService as jest.Mocked<typeof applicationService>;

const mockApplication: Application = {
  id: '1',
  company: 'Acme Corp',
  role: 'Software Engineer',
  status: ApplicationStatus.APPLIED,
  dateApplied: new Date('2024-01-15'),
  interviewDate: undefined,
  notes: 'Great company',
  createdAt: new Date('2024-01-15T00:00:00.000Z'),
  updatedAt: new Date('2024-01-15T00:00:00.000Z'),
};

// ── GET /applications ──────────────────────────────────────────────────────────

describe('GET /applications', () => {
  it('returns a list of applications with 200', async () => {
    mockService.getApplications.mockResolvedValue([mockApplication]);

    const res = await request(app).get('/applications');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].company).toBe('Acme Corp');
    expect(mockService.getApplications).toHaveBeenCalledTimes(1);
  });

  it('returns 500 when the service throws', async () => {
    mockService.getApplications.mockRejectedValue(new Error('DB connection failed'));

    const res = await request(app).get('/applications');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'DB connection failed');
  });
});

// ── GET /applications/:id ──────────────────────────────────────────────────────

describe('GET /applications/:id', () => {
  it('returns the matching application with 200', async () => {
    mockService.getApplicationById.mockResolvedValue(mockApplication);

    const res = await request(app).get('/applications/1');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe('1');
  });

  it('returns 404 when the application does not exist', async () => {
    mockService.getApplicationById.mockResolvedValue(null);

    const res = await request(app).get('/applications/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Application not found' });
  });

  it('returns 500 when the service throws', async () => {
    mockService.getApplicationById.mockRejectedValue(new Error('Query failed'));

    const res = await request(app).get('/applications/1');

    expect(res.status).toBe(500);
  });
});

// ── POST /applications ─────────────────────────────────────────────────────────

describe('POST /applications', () => {
  it('creates an application and returns 201', async () => {
    mockService.createApplication.mockResolvedValue(mockApplication);

    const res = await request(app)
      .post('/applications')
      .send({ company: 'Acme Corp', role: 'Software Engineer', dateApplied: '2024-01-15' });

    expect(res.status).toBe(201);
    expect(res.body.company).toBe('Acme Corp');
    expect(mockService.createApplication).toHaveBeenCalledWith(
      expect.objectContaining({ company: 'Acme Corp', role: 'Software Engineer' })
    );
  });

  it('returns 500 when the service throws', async () => {
    mockService.createApplication.mockRejectedValue(new Error('Insert failed'));

    const res = await request(app)
      .post('/applications')
      .send({ company: 'Acme Corp', role: 'Engineer', dateApplied: '2024-01-15' });

    expect(res.status).toBe(500);
  });
});

// ── PATCH /applications/:id ────────────────────────────────────────────────────

describe('PATCH /applications/:id', () => {
  it('updates an application and returns 200', async () => {
    const updated: Application = { ...mockApplication, status: ApplicationStatus.INTERVIEW };
    mockService.updateApplication.mockResolvedValue(updated);

    const res = await request(app).patch('/applications/1').send({ status: 'INTERVIEW' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('INTERVIEW');
  });

  it('returns 404 when the application does not exist', async () => {
    mockService.updateApplication.mockResolvedValue(null);

    const res = await request(app).patch('/applications/999').send({ status: 'REJECTED' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Application not found' });
  });
});

// ── DELETE /applications/:id ───────────────────────────────────────────────────

describe('DELETE /applications/:id', () => {
  it('deletes an application and returns 204', async () => {
    mockService.deleteApplication.mockResolvedValue(true);

    const res = await request(app).delete('/applications/1');

    expect(res.status).toBe(204);
  });

  it('returns 404 when the application does not exist', async () => {
    mockService.deleteApplication.mockResolvedValue(false);

    const res = await request(app).delete('/applications/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Application not found' });
  });
});
