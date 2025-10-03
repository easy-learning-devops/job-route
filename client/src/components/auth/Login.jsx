import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess, showRegister }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/users/login', formData);
            onLoginSuccess(res.data.token, res.data.userType);
        } catch (err) {
            console.error(err.response.data);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="form-container">
            <h2>Sign In</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                    <input type="email" name="email" value={email} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password <span className="required">*</span></label>
                    <input type="password" name="password" value={password} onChange={onChange} minLength="6" required />
                </div>
                <button type="submit" className="btn" style={{ width: '100%' }}>Login</button>
            </form>
             <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Don't have an account? <a href="#!" onClick={showRegister}>Register</a>
            </p>
        </div>
    );
};

export default Login;