import React, { useState, useEffect } from 'react';
import {
    Alert,
    Button,
    Grid,
    Paper,
    Dialog,
    DialogContent,
    DialogTitle,
    Snackbar,
    CircularProgress,
    Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { fetchLeaveRequests } from './../api/leaveRequests';
import LeaveRequestForm from './../components/LeaveRequest/LeaveRequestForm';
import LeaveRequestFilter from './../components/LeaveRequest/LeaveRequestFilter';
import { formatDate, calculateDaysFromRequest } from '../utils/formatters';

const HomePage = (): React.JSX.Element => {
    const [leaveRequests, setLeaveRequests] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(false);

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

    const handleAddLeaveRequest = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleSaveRequest = (newRequest) => {
        setOpenSnackbar(true);
        setLeaveRequests((prev) => [...prev, newRequest]);

        handleCloseModal();
    }

    const handleUpdateRequest = (updatedRequest) => {
        setOpenSnackbar(true);

        const requests = leaveRequests.map(r => {
            if (r.id === updatedRequest.id) {
                return updatedRequest;
            }
            else {
                r;
            }
        })
        ß
        setLeaveRequests(request);

        handleCloseModal();
    }

    const handleSaveError = (error) => {
        // TODO show error from API in modal
    }

    const handleFilterRequest = async (formData) => {
        setLoading(true);
        await fetchLeaveRequests(formData).then(setLeaveRequests);
        setLoading(false);
    }

    const handleRowClick = (item) => {
        setSelectedItem(item.row);

        setIsModalOpen(true);
    }

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
            <Paper sx={{  margin: 3 }}>
                <Grid container spacing={2} sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <Grid item sx={{marginLeft: 3}}>
                        <h3>Leave Requests</h3>
                    </Grid>
                    <Grid item sx={{marginRight: 3}}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddLeaveRequest} >
                            Add New
                        </Button>
                    </Grid>
                </Grid>
                <LeaveRequestFilter onSubmit={handleFilterRequest} />

                {loading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
                <DataGrid
                    rows={leaveRequests}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[1, 10]}
                    sx={{ border: 0 }}
                    onRowClick={handleRowClick}
                />

                <Grid container sx={{justifyContent: "center", alignItems: "center", marginTop: 2}}>
                    <Grid item>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddLeaveRequest} >
                            Add New Leave Request
                        </Button>
                    </Grid>
                </Grid>

            </Paper>

            <Dialog open={isModalOpen} onCancel={handleCloseModal}>
                <DialogTitle>Create New Leave Request</DialogTitle>
                <DialogContent>
                    <LeaveRequestForm
                        onSubmit={handleSaveRequest}
                        onCancel={handleCloseModal}
                        onError={handleSaveError}
                        selected={selectedItem}
                        onUpdate={handleUpdateRequest}
                    />
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
