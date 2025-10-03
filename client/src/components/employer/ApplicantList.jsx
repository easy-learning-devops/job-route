import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicantList = ({ jobId, onViewProfile, onBack }) => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobTitle, setJobTitle] = useState('');

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };

                // Fetch job title for context
                const jobRes = await axios.get(`/api/jobs/${jobId}`, config);
                setJobTitle(jobRes.data.title);

                // Fetch applicants
                const res = await axios.get(`/api/jobs/${jobId}/applicants`, config);
                setApplicants(res.data);
            } catch (err) {
                console.error('Error fetching applicants:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [jobId]);

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.put(`/api/applications/${applicationId}/status`, { status: newStatus }, config);
            
            // Update the local state to reflect the change immediately
            setApplicants(applicants.map(app => 
                app._id === applicationId ? { ...app, status: res.data.status } : app
            ));
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Could not update status.');
        }
    };

    if (loading) return <div>Loading applicants...</div>;

    return (
        <div>
            <button onClick={onBack} className="btn btn-secondary" style={{marginBottom: '1rem'}}>
                &larr; Back to My Jobs
            </button>
            <h2>Applicants for {jobTitle}</h2>
            {applicants.length > 0 ? (
                applicants.map(app => (
                    <div key={app._id} className="applicant-card">
                        <div className="applicant-card-header">
                            <div>
                                <h3 onClick={() => onViewProfile(app.applicant._id)} style={{cursor: 'pointer', display: 'inline-block'}}>{app.applicant.name}</h3>
                                <p>{app.applicant.email}</p>
                            </div>
                            <div>
                                <label htmlFor={`status-${app._id}`} style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>Status:</label>
                                <select 
                                    id={`status-${app._id}`}
                                    value={app.status} 
                                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                    style={{padding: '0.5rem', borderRadius: '5px'}}
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Viewed">Viewed</option>
                                    <option value="Shortlisted">Shortlisted</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                         <p style={{marginTop: '0.5rem'}}>Applied on: {new Date(app.applicationDate).toLocaleDateString()}</p>
                    </div>
                ))
            ) : (
                <p>No one has applied to this job yet.</p>
            )}
        </div>
    );
};

export default ApplicantList;