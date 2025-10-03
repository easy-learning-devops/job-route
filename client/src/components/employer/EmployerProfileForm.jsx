import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployerProfileForm = ({ onProfileSaved }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        companyWebsite: '',
        companyDescription: '',
        address: '',
        organizationSize: '1-10',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('/api/employer-profile/me', config);
                setFormData(res.data);
            } catch (err) {
                console.error('Failed to fetch employer profile:', err);
            }
        };
        fetchProfile();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.post('/api/employer-profile', formData, config);
            alert('Profile Saved!');
            onProfileSaved();
        } catch (err) {
            console.error(err.response.data);
            alert('Failed to save profile.');
        }
    };
    
    return (
        <div className="form-container">
            <h2>Company Profile</h2>
            <p>Keep your company information up to date.</p>
            <form onSubmit={onSubmit} style={{marginTop: '2rem'}}>
                <div className="form-group">
                    <label htmlFor="companyName">Company Name <span className="required">*</span></label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="companyWebsite">Company Website</label>
                    <input type="text" name="companyWebsite" value={formData.companyWebsite} onChange={onChange} placeholder="https://example.com" />
                </div>
                <div className="form-group">
                    <label htmlFor="companyDescription">Company Description</label>
                    <textarea name="companyDescription" value={formData.companyDescription} onChange={onChange} />
                </div>
                 <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea name="address" value={formData.address} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label>Size of Organization</label>
                    <select name="organizationSize" value={formData.organizationSize} onChange={onChange}>
                        <option>1-10</option>
                        <option>11-50</option>
                        <option>51-200</option>
                        <option>201+</option>
                    </select>
                </div>
                <button type="submit" className="btn" style={{ width: '100%' }}>Save Profile</button>
            </form>
        </div>
    );
};

export default EmployerProfileForm;