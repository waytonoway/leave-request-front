import apiClient from './index';

export const fetchLeaveTypes = async () => {
    const response = await apiClient.get('/leave-types');

    return response.data;
};
