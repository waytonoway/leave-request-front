import apiClient from './index';

export const fetchUsers = async () => {
    const response = await apiClient.get('/users');

    return response.data;
};
