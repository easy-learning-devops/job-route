import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('/api/applications/me', config);
                setApplications(res.data);
            } catch (err) {
                console.error('Error fetching applications:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    if (loading) return <div>Loading your applications...</div>;

    return (
        <div>
            <div className="page-header">
                <h2>My Job Applications</h2>
            </div>
            {applications.length > 0 ? (
                applications.map(app => (
                    <div key={app._id} className="application-card">
                        <h3>{app.job.title}</h3>
                        <p style={{ color: '#555', marginBottom: '1rem' }}>{app.job.companyName}</p>
                        <p>Applied on: {new Date(app.applicationDate).toLocaleDateString()}</p>
                        <p>
                            Status: <span className={`status-badge status-${app.status}`}>{app.status}</span>
                        </p>
                    </div>
                ))
            ) : (
                <p>You have not applied to any jobs yet.</p>
            )}
        </div>
    );
};

export default MyApplications;