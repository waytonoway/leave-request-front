import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, Select, InputLabel, Input, FormControl, FormHelperText, Grid, IconButton } from '@mui/material';
import DatePicker from 'react-datepicker';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import CloseIcon from '@mui/icons-material/Close';

import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';

import { fetchLeaveTypes } from '../../api/leaveTypes';
import { fetchUsers } from '../../api/users';
import { createLeaveRequest } from '../../api/leaveRequests';

const LeaveRequestForm = () => {
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [leaveTypes, setLeaveTypes] = useState<string[]>([]);
    const [leaveType, setLeaveType] = useState<string>('');

    const [reason, setReason] = useState<string>('');
    const [users, setUsers] = useState<string[]>([]);
    const [user, setUser] = useState<string>('');
    const [days, setDays] = useState<number>(0);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Dummy user list
    const mockedUsers = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis', 'David Clark', 'Eve White', 'Frank King', 'Grace Lee', 'Henry Moore'];

    const mockedLeaveTypes = ['personal', 'sick', 'vacation', 'bereavement'];

    useEffect(() => {
        const getLeaveTypes = async () => {
            try {
                const types = await fetchLeaveTypes()
                    .catch(() => mockedLeaveTypes);

                setLeaveTypes(types);
            } catch (error) {
                console.error('Error fetching leave types:', error);
            }
        };

        const getUsers = async () => {
            try {
                const users = await fetchUsers()
                    .catch(() => mockedUsers);

                setUsers(users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        getLeaveTypes();
        getUsers();
    }, []);

    const handleStartDateChange = (date: Date) => {
        setStartDate(date);

        const newErrors = {};
        if (endDate && date < endDate) {
            setDays(calculateDays(date, endDate));
            newErrors.startDate = '';
            newErrors.endDate = '';
        }
        else {
            newErrors.endDate = 'End date must be after start date';
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            ...newErrors
        }));
    };

    const handleEndDateChange = (date: Date) => {
        setEndDate(date);

        const newErrors = {};
        if (startDate && date > startDate) {
            setDays(calculateDays(startDate, date));
            newErrors.endDate = '';
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            ...newErrors
        }));
    };

    const calculateDays = (start: Date, end: Date) => {
        const timeDiff = end.getTime() - start.getTime();
        const diffDays = timeDiff / (1000 * 3600 * 24);

        return Math.floor(diffDays * 100) / 100;
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}; // Object to store error messages

        if (!startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!endDate || endDate < startDate) {
            newErrors.endDate = 'End date must be after start date';
        }

        if (!leaveType) {
            newErrors.leaveType = 'Leave type is required';
        }

        if (!reason || reason.length > 50) {
            newErrors.reason = 'Reason is required and must be less than 50 characters';
        }

        if (!user) {
            newErrors.user = 'User is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            return false;
        }

        setErrors({});

        return true;
    };

    const handleSave = async () => {
        if (validateForm()) {
            const formData = { startDate, endDate, leaveType, reason, user, days };
            // TODO send Save request and handle success or failure
            console.log('Leave request saved:', formData);
            const result = await createLeaveRequest(formData).then().catch();
        }
    };

    const handleReset = () => {
        setStartDate(null);
        setEndDate(null);
        setLeaveType('');
        setReason('');
        setUser('');
        setDays(0);
        setErrors({});
    };

    const handleReturn = () => {
        navigate('/');
    };

    const currentDate = new Date();
    const currentDateTime = new Date(currentDate.getTime());
    const endOfDayTime = new Date(currentDate.setHours(23, 59, 59, 0));

    return (
        <Grid container spacing={2} sx={{marginTop: 3, justifyContent: "center"}} direction="column">
            <Grid item>
                <Grid container spacing={2} sx={{justifyContent: "space-between", alignItems: "center",}} >
                    <Grid item>
                        <h1>Create Leave Request</h1>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={handleReturn} >
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <InputLabel htmlFor="startDate">Start Date*</InputLabel>
                <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    dateFormat="dd.MM.yyyy HH:mm:ss"
                    minDate={currentDate}
                    minTime={currentDateTime}
                    maxTime={endOfDayTime}
                    showTimeSelect
                    placeholderText="Select Start Date"
                    id="startDate"
                />
                {errors.startDate && <FormHelperText error={true}>{errors.startDate}</FormHelperText>}
            </Grid>

            <Grid item>
                <InputLabel htmlFor="endDate">End Date*</InputLabel>
                <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    dateFormat="dd.MM.yyyy HH:mm:ss"
                    minDate={startDate || currentDate}
                    minTime={startDate || currentDateTime}
                    maxTime={endOfDayTime}
                    showTimeSelect
                    placeholderText="Select End Date"
                    id="endDate"
                />
                {errors.endDate && <FormHelperText error={true}>{errors.endDate}</FormHelperText>}
            </Grid>
            <Grid item>
                <FormControl fullWidth>
                    <InputLabel id="leaveType">Leave Type*</InputLabel>
                    <Select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        label="Leave Type"
                        error={errors.leaveType}
                    >
                        {leaveTypes.map((leaveType, index) => (
                            <MenuItem key={index} value={leaveType}>
                                {leaveType}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item>
                <TextField
                    label="Reason*"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    inputProps={{maxLength: 50}}
                    fullWidth
                    error={errors.reason}
                />
            </Grid>
            <Grid item>
                <InputLabel>Assigned User*</InputLabel>
                <FormControl fullWidth>
                    <Select
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        label="Assign User"
                        error={errors.user}
                    >
                        {users.map((user, index) => (
                            <MenuItem key={index} value={user}>
                                {user}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item>
                <InputLabel>Number of Days</InputLabel>
                <Input disabled value={days}/>
            </Grid>

            <Grid item>
                <Grid container spacing={2} >
                    <Grid item>
                        <IconButton onClick={handleReturn} >
                            <KeyboardReturnIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="secondary" onClick={handleReset}>
                            Reset
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default LeaveRequestForm;
