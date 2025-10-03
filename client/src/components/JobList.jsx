import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './JobCard';

const JobList = ({ onViewDetails }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Pass token to fetch jobs
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('/api/jobs', config);
                setJobs(res.data);
            } catch (err) {
                console.error('Error fetching jobs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return <div>Loading jobs...</div>;
    }

    return (
        <div>
            <h2>Available Jobs</h2>
            {jobs.length > 0 ? (
                jobs.map(job => <JobCard key={job._id} job={job} onViewDetails={onViewDetails} />)
            ) : (
                <p>No jobs found.</p>
            )}
        </div>
    );
};

export default JobList;