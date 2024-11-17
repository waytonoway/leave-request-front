import React, { useState, useEffect } from 'react';
import { Alert, Button, Grid, Paper, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

import { fetchLeaveRequests } from './../api/leaveRequests';
import LeaveRequestForm from './../components/LeaveRequest/LeaveRequestForm';
import { formatDate, calculateDaysFromRequest } from '../utils/formatters';

const HomePage = (): React.JSX.Element => {
    const [leaveRequests, setLeaveRequests] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar visibility

    const navigate = useNavigate();

    const handleAddLeaveRequest = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleSaveRequest = (newRequest) => {
        setLeaveRequests((prev) => [...prev, newRequest]);

        handleCloseModal();
    }

    const handleSaveError = (error) => {
        // TODO show error from API in modal
    }

    // TODO
    useEffect(() => {
        const getLeaveRequests = async () => {
            try {
                await fetchLeaveRequests().then(setLeaveRequests);
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
            width: 250,
            valueGetter: (value, row) => `${row.user.firstName} ${row.user.middleName || ''} ${row.user.lastName}`,
        },
        {
            field: 'days',
            headerName: 'Days',
            type: 'number',
            width: 70,
            valueGetter: (value, row) => calculateDaysFromRequest(row)
        },
        { field: 'startDate', headerName: 'Start Date', width: 200, valueFormatter: formatDate },
        { field: 'endDate', headerName: 'End Date', width: 200, valueFormatter: formatDate  },
        {
            field: 'leaveType',
            headerName: 'Leave Type',
            valueGetter: (value, row) => `${row.leaveType.type}`,
            width: 130
        },
        { field: 'reason', headerName: 'Reason', width: 300 },
    ];

    const paginationModel = { page: 0, pageSize: 10 };

    return (
        <div>
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
            <Dialog open={isModalOpen} onCancel={handleCloseModal}>
                <DialogTitle>Create New Leave Request</DialogTitle>
                <DialogContent>
                    <LeaveRequestForm onSubmit={handleSaveRequest} onCancel={handleCloseModal} onError={handleSaveError} />
                </DialogContent>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Your request was submitted
                </Alert>
            </Snackbar>

        </div>
    );
};

export default HomePage;
