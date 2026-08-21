import apiClient from "../api/apiClient";

export interface Patient {
  _id: string;

  fullName?: string;
  name?: string;

  sex?: string;
  age?: number;

  phone?: string;

  region?: string;
  zone?: string;
  woreda?: string;

  facility:
    | string
    | {
        _id: string;
        name: string;
      };

  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientRequest {
  fullName: string;
  sex: string;
  age: number;
  phone?: string;
  region?: string;
  zone?: string;
  woreda?: string;
  facility: string;
}

export const getPatients = async () => {
  const response = await apiClient.get<{
    count: number;
    patients: Patient[];
  }>("/patients");

  return response.data;
};

export const getPatientById = async (
  id: string
) => {
  const response =
    await apiClient.get<{
      patient: Patient;
    }>(`/patients/${id}`);

  return response.data;
};

export const createPatient = async (
  data: CreatePatientRequest
) => {
  const response =
    await apiClient.post<{
      message: string;
      patient: Patient;
    }>("/patients", data);

  return response.data;
};