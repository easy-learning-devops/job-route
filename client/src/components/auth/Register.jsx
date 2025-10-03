import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegisterSuccess, showLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const payload = { ...formData, role: 'jobseeker' };
            const res = await axios.post('/api/users/register', payload);
            onRegisterSuccess(res.data.token);
        } catch (err) {
            console.error(err.response.data);
            alert('Registration failed. User might already exist.');
        }
    };

    return (
        <div className="form-container">
            <h2>Create Your Account</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name <span className="required">*</span></label>
                    <input type="text" name="name" value={name} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                    <input type="email" name="email" value={email} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password <span className="required">*</span></label>
                    <input type="password" name="password" value={password} onChange={onChange} minLength="6" required />
                </div>
                <button type="submit" className="btn" style={{ width: '100%' }}>Register</button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Already have an account? <a href="#!" onClick={showLogin}>Login</a>
            </p>
        </div>
    );
};

export default Register;