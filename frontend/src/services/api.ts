import axios from 'axios';
import type { Application, CreateApplicationDTO, UpdateApplicationDTO } from '../types';

const API_URL = 'http://localhost:3000/applications';

export const getApplications = async (): Promise<Application[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getApplicationById = async (id: string): Promise<Application> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createApplication = async (data: CreateApplicationDTO): Promise<Application> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateApplication = async (id: string, data: UpdateApplicationDTO): Promise<Application> => {
  const response = await axios.patch(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
