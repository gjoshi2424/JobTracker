import { pool } from '../db';
import { Application, CreateApplicationDTO, UpdateApplicationDTO } from '../models/Application';
import { triggerWebhook } from './webhookService';

export const getApplications = async (): Promise<Application[]> => {
  const result = await pool.query('SELECT * FROM applications ORDER BY "createdAt" DESC');
  return result.rows;
};

export const getApplicationById = async (id: string): Promise<Application | null> => {
  const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const createApplication = async (data: CreateApplicationDTO): Promise<Application> => {
  const { company, role, status = 'APPLIED', dateApplied, notes } = data;
  const result = await pool.query(
    `INSERT INTO applications (company, role, status, "dateApplied", notes)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [company, role, status, dateApplied, notes]
  );
  
  const application = result.rows[0];
  
  // Trigger Zapier Webhook
  triggerWebhook('Application Created', application);
  
  return application;
};

export const updateApplication = async (id: string, data: UpdateApplicationDTO): Promise<Application | null> => {
  const oldApp = await getApplicationById(id);
  if (!oldApp) return null;

  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (key === 'dateApplied') {
        fields.push(`"dateApplied" = $${index}`);
      } else {
        fields.push(`${key} = $${index}`);
      }
      values.push(value);
      index++;
    }
  }

  if (fields.length === 0) return oldApp;

  fields.push(`"updatedAt" = CURRENT_TIMESTAMP`);
  
  const query = `UPDATE applications SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
  values.push(id);

  const result = await pool.query(query, values);
  const updatedApp = result.rows[0] || null;

  if (updatedApp && data.status && oldApp.status !== data.status) {
    triggerWebhook('Status Updated', updatedApp);
  }

  return updatedApp;
};

export const deleteApplication = async (id: string): Promise<boolean> => {
  const result = await pool.query('DELETE FROM applications WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};
