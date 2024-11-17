import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, Select, InputLabel, Input, FormControl, FormHelperText, Grid, IconButton } from '@mui/material';
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";

import { fetchUsers } from '../../api/users';

const LeaveRequestFilter = ({ onSubmit }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [users, setUsers] = useState<string[]>([]);
    const [user, setUser] = useState<number>('');

    const [searchQuery, setSearchQuery] = useState<string>('');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const getUsers = async () => {
            try {
                await fetchUsers()
                    .then(users => setUsers(users));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        getUsers();
    }, []);

    const applyFilter = async () => {
        const keys = { startDate, endDate, user, searchQuery };
        const formData = Object.keys(keys).reduce((acc, key) => {
            if (!!keys[key]) {
                acc[key] = keys[key];
            }

            return acc;
        }, {});

        onSubmit({ ...formData });
    };

    const handleReset = () => {
        setStartDate(null);
        setEndDate(null);
        setUser('');
        setSearchQuery('');
        setErrors({});

        onSubmit({});
    };

    return (
        <Grid container spacing={2} sx={{margin: 3, alignItems: "end"}}>
            <Grid item sm={2}>
                <FormControl fullWidth>
                    <InputLabel >Assigned user</InputLabel>
                    <Select
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
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
            <Grid item sm={2}>
                <InputLabel htmlFor="startDate">Start Date</InputLabel>
                <DatePicker
                    selected={startDate}
                    onChange={setStartDate}
                    dateFormat="dd.MM.yyyy HH:mm:ss"
                    showTimeSelect
                    placeholderText="Select Start Date"
                    id="startDate"
                />
                {errors.startDate && <FormHelperText error={true}>{errors.startDate}</FormHelperText>}
            </Grid>
            <Grid item sm={2}>
                <InputLabel htmlFor="endDate">End Date</InputLabel>
                <DatePicker
                    selected={endDate}
                    onChange={setEndDate}
                    dateFormat="dd.MM.yyyy HH:mm:ss"
                    showTimeSelect
                    placeholderText="Select End Date"
                    id="endDate"
                />
                {errors.endDate && <FormHelperText error={true}>{errors.endDate}</FormHelperText>}
            </Grid>
            <Grid item sm={5}>
                <TextField
                    label="Search by reason..."
                    value={searchQuery}
                    inputProps={{maxLength: 100}}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid item sm={3}>
                <Grid container spacing={2} >
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={applyFilter}>
                            Filter
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="secondary" onClick={handleReset}>
                            Reset
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default LeaveRequestFilter;
