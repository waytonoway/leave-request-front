import apiClient from './index';

export const fetchLeaveRequests = async () => {
    const response = await apiClient.get('/leave-requests');

    return response.data;
};

export const createLeaveRequest = async (data: any) => {
    const response = await apiClient.post('/leave-requests', data);

    return response.data;
};

export const updateLeaveRequest = async (id: number, data: any) => {
    const response = await apiClient.put(`/leave-requests/${id}`, data);

    return response.data;
};

export const deleteLeaveRequest = async (id: number) => {
    const response = await apiClient.delete(`/leave-requests/${id}`);

    return response.data;
};
