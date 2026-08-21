import apiClient from "../api/apiClient";

export interface MalariaCase {
  _id: string;

  patient:
    | string
    | {
        _id: string;
        fullName?: string;
        name?: string;
        sex?: string;
      };

  facility:
    | string
    | {
        _id: string;
        name: string;
      };

  diagnosisDate?: string;
  diagnosis?: string;
  malariaSpecies?: string;
  treatment?: string;
  outcome?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMalariaCaseRequest {
  patient: string;
  facility: string;
  diagnosisDate: string;
  diagnosis?: string;
  malariaSpecies?: string;
  treatment?: string;
  outcome?: string;
}

export const getMalariaCases = async () => {
  const response = await apiClient.get<{
    count: number;
    cases: MalariaCase[];
  }>("/malaria-cases");

  return response.data;
};

export const getMalariaCaseById = async (
  id: string
) => {
  const response =
    await apiClient.get<{
      malariaCase: MalariaCase;
    }>(`/malaria-cases/${id}`);

  return response.data;
};

export const createMalariaCase = async (
  data: CreateMalariaCaseRequest
) => {
  const response =
    await apiClient.post<{
      message: string;
      malariaCase: MalariaCase;
    }>("/malaria-cases", data);

  return response.data;
};