import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobDetails = ({ jobId, onBack }) => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applied, setApplied] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get(`/api/jobs/${jobId}`, config);
                setJob(res.data);
            } catch (err) {
                console.error('Error fetching job details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [jobId]);

    const handleApply = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.post(`/api/jobs/${jobId}/apply`, {}, config);
            setApplied(true);
            setError('');
             alert('Application successful!');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Failed to apply. Please try again.';
            setError(errorMsg);
            alert(errorMsg);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!job) return <div>Job not found.</div>;

    return (
        <div>
            <button onClick={onBack} className="btn btn-secondary" style={{marginBottom: '1rem'}}>
                &larr; Back to Jobs
            </button>
            <div className="details-view">
                <h2>{job.title}</h2>
                <h4>{job.companyName} - {job.location}</h4>
                
                <div className="details-section">
                    <h5>Job Description</h5>
                    <p>{job.description}</p>
                </div>

                <div className="details-section">
                    <h5>Salary</h5>
                    <p>₹{job.salaryMin} - ₹{job.salaryMax} per month {job.hasBonus && '(+ Bonus)'}</p>
                </div>

                 <div className="details-section">
                    <h5>Skills Required</h5>
                    <p>{job.skills.join(', ')}</p>
                </div>

                <div className="details-section">
                    <h5>Timings</h5>
                    <p><strong>Job Timings:</strong> {job.jobTimings}</p>
                    <p><strong>Interview Details:</strong> {job.interviewDetails}</p>
                </div>

                <button onClick={handleApply} disabled={applied} className="btn" style={{width: '100%', marginTop: '1rem'}}>
                    {applied ? 'Applied' : 'Apply Now'}
                </button>
                {error && <p style={{color: 'red', marginTop: '1rem'}}>{error}</p>}
            </div>
        </div>
    );
};

export default JobDetails;