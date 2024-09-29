import axiosInstance from './axiosInstance';

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
