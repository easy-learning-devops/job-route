import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyJobs = ({ onViewApplicants }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { 
                    headers: { 'x-auth-token': token },
                    params: { postedBy: 'me' } // Filter by current user
                };
                const res = await axios.get('/api/jobs', config);
                setJobs(res.data);
            } catch (err) {
                console.error('Error fetching jobs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyJobs();
    }, []);

    if (loading) return <div>Loading your jobs...</div>;

    return (
        <div>
            <div className="page-header">
                <h2>My Job Postings</h2>
            </div>
            {jobs.length > 0 ? (
                jobs.map(job => (
                    <div key={job._id} className="job-card">
                        <h3>{job.title}</h3>
                        <p>{job.location}</p>
                        <p><strong>Openings:</strong> {job.openings}</p>
                        <div className="job-card-actions">
                            <button onClick={() => onViewApplicants(job._id)} className="btn">
                                View Applicants
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>You have not posted any jobs yet.</p>
            )}
        </div>
    );
};

export default MyJobs;
