import React from 'react';

const JobCard = ({ job, onViewDetails }) => {
    const { title, companyName, location, salaryMin, salaryMax, description } = job;
    return (
        <div className="job-card">
            <h3>{title}</h3>
            <h4>{companyName}</h4>
            <p>{location}</p>
            <p><strong>Salary:</strong> {salaryMin && salaryMax ? `₹${salaryMin} - ₹${salaryMax} per month` : 'Not Disclosed'}</p>
            <p>{description.substring(0, 150)}...</p>
            <div className="job-card-actions">
                <button onClick={() => onViewDetails(job._id)} className="btn">View Details</button>
            </div>
        </div>
    );
};

export default JobCard;