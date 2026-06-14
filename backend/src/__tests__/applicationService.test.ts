/**
 * applicationService.test.ts
 *
 * Service-level tests that verify webhook behaviour.
 *
 * Why a separate file from applications.test.ts?
 * ─────────────────────────────────────────────────
 * The route tests in applications.test.ts mock the *entire* applicationService
 * module (`jest.mock('../services/applicationService')`), so the real service
 * code — including the triggerWebhook calls — never runs there.  To assert on
 * webhook behaviour we need to test the service directly, supplying our own
 * mocks for its two dependencies: the pg pool and webhookService.
 */

import { pool } from '../db';
import * as webhookService from '../services/webhookService';
import {
  createApplication,
  updateApplication,
} from '../services/applicationService';
import { ApplicationStatus } from '../models/Application';

// ── Mock dependencies ──────────────────────────────────────────────────────────

jest.mock('../db', () => ({
  pool: { query: jest.fn() },
}));

jest.mock('../services/webhookService');

const mockQuery = pool.query as jest.Mock;
const mockTriggerWebhook = webhookService.triggerWebhook as jest.Mock;

// ── Shared fixture ─────────────────────────────────────────────────────────────

const dbRow = {
  id: '1',
  company: 'Acme Corp',
  role: 'Software Engineer',
  status: ApplicationStatus.APPLIED,
  dateApplied: new Date('2024-01-15'),
  interviewDate: undefined,
  notes: null,
  createdAt: new Date('2024-01-15T00:00:00.000Z'),
  updatedAt: new Date('2024-01-15T00:00:00.000Z'),
};

// ── createApplication ──────────────────────────────────────────────────────────

describe('createApplication — webhook', () => {
  it('calls triggerWebhook with "Application Created" after a successful insert', async () => {
    mockQuery.mockResolvedValue({ rows: [dbRow] });

    const result = await createApplication({
      company: 'Acme Corp',
      role: 'Software Engineer',
      dateApplied: '2024-01-15',
    });

    expect(mockTriggerWebhook).toHaveBeenCalledTimes(1);
    expect(mockTriggerWebhook).toHaveBeenCalledWith('Application Created', dbRow);
    expect(result).toEqual(dbRow);
  });
});

// ── updateApplication ──────────────────────────────────────────────────────────

describe('updateApplication — webhook', () => {
  it('calls triggerWebhook with "Status Updated" when the status changes', async () => {
    const updatedRow = { ...dbRow, status: ApplicationStatus.INTERVIEW };

    // First query: getApplicationById lookup
    // Second query: UPDATE … RETURNING *
    mockQuery
      .mockResolvedValueOnce({ rows: [dbRow] })
      .mockResolvedValueOnce({ rows: [updatedRow] });

    await updateApplication('1', { status: ApplicationStatus.INTERVIEW });

    expect(mockTriggerWebhook).toHaveBeenCalledTimes(1);
    expect(mockTriggerWebhook).toHaveBeenCalledWith('Status Updated', updatedRow);
  });

  it('does NOT call triggerWebhook when only non-status fields change', async () => {
    const updatedRow = { ...dbRow, notes: 'Updated notes' };

    mockQuery
      .mockResolvedValueOnce({ rows: [dbRow] })
      .mockResolvedValueOnce({ rows: [updatedRow] });

    await updateApplication('1', { notes: 'Updated notes' });

    expect(mockTriggerWebhook).not.toHaveBeenCalled();
  });

  it('does NOT call triggerWebhook when the status value is the same', async () => {
    const sameStatusRow = { ...dbRow };

    mockQuery
      .mockResolvedValueOnce({ rows: [sameStatusRow] })
      .mockResolvedValueOnce({ rows: [sameStatusRow] });

    await updateApplication('1', { status: ApplicationStatus.APPLIED });

    expect(mockTriggerWebhook).not.toHaveBeenCalled();
  });

  it('returns null and does NOT call triggerWebhook when the application is not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] }); // getApplicationById → not found

    const result = await updateApplication('999', { status: ApplicationStatus.REJECTED });

    expect(result).toBeNull();
    expect(mockTriggerWebhook).not.toHaveBeenCalled();
  });
});
