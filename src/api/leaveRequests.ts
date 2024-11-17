import apiClient from './index';

import { mapEntity, mapForm, mapToQuery } from '../utils/mappers';

export const fetchLeaveRequests = async (filter?: Object) => {
    let query = null;
    if (filter) {
        query = mapToQuery(filter);
    }

    const response = await apiClient.get('/leave-requests' + (query ? `?${query}` : ''));
    const items = response.data;

    return items.map(mapEntity);
};

export const createLeaveRequest = async (data: any) => {
    const formData = mapForm(data);

    try {
        const response = await apiClient.post('/leave-requests', formData);

        return mapEntity(response.data);

    } catch (error) {
        // TODO handle error nicely
        console.log('e', error.response );
    }
};

// Further methods were not tested yet
export const updateLeaveRequest = async (id: number, data: any) => {
    const response = await apiClient.put(`/leave-requests/${id}`, data);

    return mapEntity(response.data);
};

export const deleteLeaveRequest = async (id: number) => {
    const response = await apiClient.delete(`/leave-requests/${id}`);

    return mapEntity(response.data);
};
