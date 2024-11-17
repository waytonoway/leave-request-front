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
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(false);
    const [totalRowCount, setTotalRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
        total: 0
    });
    const [filterModel, setFilterModel] = useState({});

    const getLeaveRequests = async (pagination, filter) => {
        setLoading(true);

        try {
            await fetchLeaveRequests({...filter, page: pagination.page + 1, limit: pagination.pageSize})
                .then(({ items, total }) => {
                    setLeaveRequests(items);
                    setTotalRowCount(total);
                });
        } catch (error) {
            console.error('Error fetching leave requests:', error);
        }

        setLoading(false);
    };

    useEffect(() => {
        const { page, pageSize } = paginationModel;

        getLeaveRequests({ page, pageSize }, leaveRequests);
    }, []);

    const handlePaginationModelChange = (params) => {
        setPaginationModel((prevModel) => {
            if (prevModel.pageSize !== params.pageSize) {
                params.page = 0;
            }

            return {
                ...prevModel,
                ...params
            };
        });

        const { page, pageSize } = paginationModel;

        getLeaveRequests({ page, pageSize }, filterModel);
    }

    const handleFilterRequest = async (formData) => {
        const { page, pageSize } = paginationModel;

        if (Object.keys(formData).length) {
            formData.startDate && (formData.startDate = formData.startDate.getTime() / 1000);
            formData.endDate && (formData.endDate = formData.endDate.getTime() / 1000);
            setFilterModel(formData);
        } else {
            setFilterModel({});
        }

        getLeaveRequests({ page, pageSize }, formData);
    }

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
        const { pageSize } = paginationModel;

        getLeaveRequests({ page: 0, pageSize }, leaveRequests);

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

        setLeaveRequests(requests);

        handleCloseModal();
    }

    const handleSaveError = (error) => {
        // TODO show error from API in modal
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
                    paginationModel={paginationModel}
                    pagination
                    paginationMode="server"
                    rowCount={totalRowCount}
                    pageSize={paginationModel.pageSize}
                    sx={{ border: 0 }}
                    onRowClick={handleRowClick}
                    pageSizeOptions={[10, 20, 50]}
                    onPaginationModelChange={handlePaginationModelChange}
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
