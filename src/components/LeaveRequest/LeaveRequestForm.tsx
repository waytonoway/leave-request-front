import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, Select, InputLabel, Input, FormControl, FormHelperText, Grid, IconButton } from '@mui/material';
import DatePicker from 'react-datepicker';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';

import { fetchLeaveTypes } from '../../api/leaveTypes';
import { fetchUsers } from '../../api/users';
import { createLeaveRequest } from '../../api/leaveRequests';
import { calculateDays } from '../../utils/formatters';

const LeaveRequestForm = ({ onCancel, onSubmit, onError }) => {
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [leaveTypes, setLeaveTypes] = useState<string[]>([]);
    const [leaveType, setLeaveType] = useState<number>('');

    const [reason, setReason] = useState<string>('');
    const [users, setUsers] = useState<string[]>([]);
    const [user, setUser] = useState<number>('');
    const [days, setDays] = useState<number>(0);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const getLeaveTypes = async () => {
            try {
                await fetchLeaveTypes()
                    .then(types => setLeaveTypes(types));
            } catch (error) {
                console.error('Error fetching leave types:', error);
            }
        };

        const getUsers = async () => {
            try {
                await fetchUsers()
                    .then(users => setUsers(users));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        getLeaveTypes();
        getUsers();
    }, []);

    const handleLeaveTypeChange = (event: Event, fieldName: string) => {
        setLeaveType(event.target.value);

        setErrors((prevErrors) => ({...prevErrors, leaveType: ''}));
    }

    // TODO combine with method above and use method by field name as second argument
    const handleUserChange = (event: Event) => {
        setUser(event.target.value);

        setErrors((prevErrors) => ({...prevErrors, user: ''}));
    }

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
        if (validateForm() || true) {
            const formData = { startDate, endDate, leaveType, reason, user };

            const result = await createLeaveRequest(formData)
                .then(onSubmit)
                .catch(onError);
        }
    };

    const handleReset = () => {
        setStartDate(null);
        setEndDate(null);
        setLeaveType(null);
        setReason('');
        setUser(null);
        setDays(0);
        setErrors({});
    };

    const currentDate = new Date();
    const currentDateTime = new Date(currentDate.getTime());
    const endOfDayTime = new Date(currentDate.setHours(23, 59, 59, 0));

    return (
        <Grid container spacing={2} sx={{marginTop: 3, justifyContent: "center"}}>
            <Grid item sm={6} >
                <FormControl fullWidth>
                    <InputLabel id="leaveType">Leave Type*</InputLabel>
                    <Select
                        value={leaveType}
                        onChange={handleLeaveTypeChange}
                        label="Leave Type"
                        error={!!errors.leaveType}
                    >
                        {leaveTypes.map((leaveType, index) => (
                            <MenuItem key={index} value={leaveType.id}>
                                {leaveType.type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item sm={6}>
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
            <Grid item sm={6}>
                <TextField
                    label="Reason*"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    inputProps={{maxLength: 50}}
                    fullWidth
                    error={!!errors.reason}
                />
            </Grid>

            <Grid item sm={6}>
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

            <Grid item sm={6}>
                <InputLabel>Assigned User*</InputLabel>
                <FormControl fullWidth>
                    <Select
                        value={user}
                        onChange={handleUserChange}
                        label="Assign User"
                        error={!!errors.user}
                    >
                        {users.map((user, index) => (
                            <MenuItem key={index} value={user.id}>
                                {user.first_name} {user.middle_name} {user.last_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item sm={6}>
                <InputLabel>Number of Days</InputLabel>
                <Input disabled value={days}/>
            </Grid>

            <Grid item sm={6} offset={6}>
                <Grid container spacing={2} >
                    <Grid item>
                        <IconButton onClick={handleReset} >
                            <CleaningServicesIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="secondary" onClick={onCancel}>
                            Cancel
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
