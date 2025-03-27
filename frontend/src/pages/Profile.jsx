import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';

const Profile = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    dateOfBirth: dayjs(),
    gender: null
  });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // Fetch profile data from the backend
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          address: response.data.address || '',
          phone: response.data.phone || '',
          dateOfBirth: response.data.dateOfBirth || dayjs(),
          gender: response.data.gender || null
        });
      } catch (error) {
        alert('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, dateOfBirth: newDate.toISOString() });
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>

        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', alignItems: 'center', marginBottom: 2 }}>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of birth"
              value={dayjs(formData.dateOfBirth)}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth/>}
            />
          </LocalizationProvider>

          <TextField
            select
            label="Gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            sx={{ minWidth: 200 }}
          >
            <MenuItem key='Male' value='Male'>Male</MenuItem>
            <MenuItem key='Female' value='Female'>Female</MenuItem>
          </TextField>
        </Box>

        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
