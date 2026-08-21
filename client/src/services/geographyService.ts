import apiClient from "../api/apiClient";

export interface Region {
  _id: string;
  name: string;
  code?: string;
}

export interface Zone {
  _id: string;
  name: string;
  code?: string;
  region:
    | string
    | {
        _id: string;
        name: string;
      };
}

export interface Woreda {
  _id: string;
  name: string;
  code?: string;
  zone:
    | string
    | {
        _id: string;
        name: string;
      };
}

export const getRegions = async () => {
  const response =
    await apiClient.get<{
      count: number;
      regions: Region[];
    }>("/regions");

  return response.data;
};

export const getZones = async () => {
  const response =
    await apiClient.get<{
      count: number;
      zones: Zone[];
    }>("/zones");

  return response.data;
};

export const getWoredas = async () => {
  const response =
    await apiClient.get<{
      count: number;
      woredas: Woreda[];
    }>("/woredas");

  return response.data;
};