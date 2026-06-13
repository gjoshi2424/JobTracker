import { Request, Response } from 'express';
import * as service from '../services/applicationService';

export const getApplications = async (req: Request, res: Response) => {
  try {
    const apps = await service.getApplications();
    res.json(apps);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const app = await service.getApplicationById(req.params.id as string);
    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(app);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createApplication = async (req: Request, res: Response) => {
  try {
    const app = await service.createApplication(req.body);
    res.status(201).json(app);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const app = await service.updateApplication(req.params.id as string, req.body);
    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(app);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const success = await service.deleteApplication(req.params.id as string);
    if (!success) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
