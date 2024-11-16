import React, { useState, useEffect } from 'react';
import {Button, Grid, Paper, Typography,} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

import { fetchLeaveRequests } from './../api/leaveRequests';

// TODO fetch from API
const mockLeaveRequests = [
    { id: 1, user: { id: 1, firstName: 'John', lastName: 'Doe' }, startDate: '2024-11-01', endDate: '2024-11-05', leaveType: 'Vacation', days: 4 },
    { id: 2, user: { id: 2, firstName: 'Jane', lastName: 'Smith' }, startDate: '2024-11-10', endDate: '2024-11-12', leaveType: 'Sick', days: 2 },
];

const HomePage = (): React.JSX.Element => {
    const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);

    const navigate = useNavigate();

    const handleAddLeaveRequest = () => {
        navigate('/add-leave-request');
    };
    // TODO
    useEffect(() => {
        const getLeaveRequests = async () => {
            try {
                const requests = await fetchLeaveRequests()
                    .catch(() => mockLeaveRequests);
                setLeaveRequests(requests)
            } catch (error) {
                console.error('Error fetching leave requests:', error);
            }
        };

        getLeaveRequests();
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'user',
            headerName: 'User',
            width: 200,
            valueGetter: (value, row) => `${row.user.firstName} ${row.user.middleName || ''} ${row.user.lastName}`, // Extract full name
        },
        { field: 'startDate', headerName: 'Start Date', width: 130 },
        { field: 'endDate', headerName: 'End Date', width: 130 },
        { field: 'leaveType', headerName: 'Leave Type', width: 130 },
        { field: 'reason', headerName: 'Reason', width: 130 },
        { field: 'days', headerName: 'Days', type: 'number', width: 130 },
    ];
    const paginationModel = { page: 0, pageSize: 10 };

    return (
        <Grid container direction="column" sx={{
            justifyContent: "space-between",
            alignItems: "center",
        }}>
            <Grid container spacing={2} sx={{
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <Grid item>
                    <Typography variant="h3" gutterBottom>Leave Requests</Typography>
                </Grid>
                <Grid item>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddLeaveRequest} >
                        Add New
                    </Button>
                </Grid>
            </Grid>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={leaveRequests}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[1, 10]}
                    checkboxSelection
                    sx={{ border: 0 }}
                />
            </Paper>

            <Grid container sx={{justifyContent: "center", alignItems: "center", marginTop: 2}}>
                <Grid item>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddLeaveRequest} >
                        Add New Leave Request
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default HomePage;
