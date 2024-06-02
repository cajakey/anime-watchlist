import axios from 'axios';
import { Anime } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const getAnimeList = async (titleFilter?: string): Promise<Anime[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/animes`, {
      params: {
        title: titleFilter,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching anime list', error);
    throw error;
  }
};

export const createAnime = async (anime: Anime): Promise<Anime[]> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/animes`, anime);
    return response.data;
  } catch (error) {
    console.error('Error creating anime', error);
    throw error;
  }
};

export const updateAnime = async (id: number | undefined, updatedAnime: Partial<Anime>): Promise<Anime[]> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/animes/${id}`, updatedAnime);
    return response.data;
  } catch (error) {
    console.error('Error updating anime', error);
    throw error;
  }
};

export const deleteAnime = async (id: number | undefined): Promise<Anime[]> => {
  try {
    await axios.delete(`${API_BASE_URL}/animes/${id}`);
    const response = await axios.get(`${API_BASE_URL}/animes`);
    return response.data;
  } catch (error) {
    console.error('Error deleting anime', error);
    throw error;
  }
};