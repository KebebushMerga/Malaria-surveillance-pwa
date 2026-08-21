import apiClient from "../api/apiClient";

export interface HealthFacility {
  _id: string;
  name: string;
  code?: string;
  woreda:
    | string
    | {
        _id: string;
        name: string;
        code?: string;
      };
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getHealthFacilities = async () => {
  const response =
    await apiClient.get<{
      count: number;
      facilities: HealthFacility[];
    }>("/health-facilities");

  return response.data;
};

export const getHealthFacilityById = async (
  id: string
) => {
  const response =
    await apiClient.get<{
      facility: HealthFacility;
    }>(`/health-facilities/${id}`);

  return response.data;
};

export const createHealthFacility = async (
  data: {
    name: string;
    code?: string;
    woreda: string;
    address?: string;
    phone?: string;
  }
) => {
  const response =
    await apiClient.post<{
      message: string;
      facility: HealthFacility;
    }>("/health-facilities", data);

  return response.data;
};