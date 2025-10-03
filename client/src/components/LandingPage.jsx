import React from 'react';

const LandingPage = ({ onWantJob, onWantToHire }) => {
    return (
        <div className="landing">
            <h1>Welcome to JobConnect</h1>
            <p>Your one-stop portal for finding the perfect job or the perfect candidate.</p>
            <div className="landing-buttons">
                <button onClick={onWantJob} className="btn">I want a job</button>
                <button className="btn btn-secondary" onClick={onWantToHire}>I want to hire people</button>
            </div>
        </div>
    );
};

export default LandingPage;