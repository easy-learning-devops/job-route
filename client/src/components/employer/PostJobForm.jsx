import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostJobForm = ({ onJobPosted }) => {
    const [formData, setFormData] = useState({
        jobType: 'Full Time',
        title: '',
        location: 'Patna',
        subLocation: '',
        openings: '',
        experienceRequired: 'Any',
        salaryMin: '',
        salaryMax: '',
        hasBonus: false,
        description: '',
        skills: '',
        jobTimings: '9:30 AM - 6:30 PM | Monday to Saturday',
        interviewDetails: '11:00 AM - 4:00 PM | Monday to Saturday',
        companyName: '',
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        contactPersonProfile: 'HR/Owner',
        organizationSize: '1-10',
        jobAddress: '',
        hiringFrequency: '',
    });
    const [jobTitles, setJobTitles] = useState([]);

    useEffect(() => {
        const fetchJobTitles = async () => {
            try {
                const res = await axios.get('/api/job-titles');
                setJobTitles(res.data);
            } catch (err) {
                console.error("Could not fetch job titles", err);
            }
        };
        fetchJobTitles();
    }, []);

    const { ...data } = formData;

    const onChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            // Simple skills split, a real app would use a tagging library
            const payload = { ...formData, skills: formData.skills.split(',').map(s => s.trim()) };
            
            await axios.post('/api/jobs', payload, config);
            alert('Job Posted Successfully!');
            onJobPosted(); // Redirect to My Jobs page
        } catch (err) {
            console.error(err.response ? err.response.data : err);
            alert('Failed to post job. Please check all fields.');
        }
    };

    return (
        <div className="post-job-container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                <h2 style={{textAlign: 'left', margin: 0}}>Post a New Job</h2>
                <p style={{color: '#4a1de9', fontWeight: 500}}>Need Help? Call us at 08069824660</p>
            </div>
            <form onSubmit={onSubmit}>
                <div className="form-section">
                    <h3 className="form-section-header">Basic Job Detail</h3>
                    <div className="form-group">
                        <label>Job Type <span className="required">*</span></label>
                        <div className="btn-group">
                            <button type="button" className={`btn-option ${data.jobType === 'Full Time' ? 'selected' : ''}`} onClick={() => setFormData({...formData, jobType: 'Full Time'})}>Full Time</button>
                            <button type="button" className={`btn-option ${data.jobType === 'Part Time' ? 'selected' : ''}`} onClick={() => setFormData({...formData, jobType: 'Part Time'})}>Part Time</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Job Title <span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="title" 
                            value={data.title} 
                            onChange={onChange} 
                            placeholder="Enter the Job Title" 
                            list="job-titles-list"
                            required
                        />
                        <datalist id="job-titles-list">
                            {jobTitles.map((title, index) => (
                                <option key={index} value={title} />
                            ))}
                        </datalist>
                    </div>
                    <div className="form-group">
                        <label>Job Location <span className="required">*</span></label>
                        <div className="form-row">
                            <select name="location" value={data.location} onChange={onChange}>
                                <option>Patna</option>
                                <option>Mumbai</option>
                                <option>Delhi</option>
                                <option>Bangalore</option>
                            </select>
                            <input type="text" name="subLocation" value={data.subLocation} onChange={onChange} placeholder="eg: Dadar"/>
                        </div>
                    </div>
                     <div className="form-group">
                        <label>No Of Openings <span className="required">*</span></label>
                        <input type="number" name="openings" value={data.openings} onChange={onChange} placeholder="Eg. 2" required/>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-section-header">Candidate Requirements</h3>
                     <div className="form-group">
                        <label>Total Experience of Candidate <span className="required">*</span></label>
                        <div className="btn-group">
                            <button type="button" className={`btn-option ${data.experienceRequired === 'Any' ? 'selected' : ''}`} onClick={() => setFormData({...formData, experienceRequired: 'Any'})}>Any</button>
                            <button type="button" className={`btn-option ${data.experienceRequired === 'Fresher Only' ? 'selected' : ''}`} onClick={() => setFormData({...formData, experienceRequired: 'Fresher Only'})}>Fresher Only</button>
                            <button type="button" className={`btn-option ${data.experienceRequired === 'Experienced Only' ? 'selected' : ''}`} onClick={() => setFormData({...formData, experienceRequired: 'Experienced Only'})}>Experienced Only</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Monthly In-hand Salary <span className="required">*</span></label>
                        <div className="salary-group">
                           <input type="number" name="salaryMin" value={data.salaryMin} onChange={onChange} placeholder="Eg. 10000" required/>
                           <span>to</span>
                           <input type="number" name="salaryMax" value={data.salaryMax} onChange={onChange} placeholder="Eg. 15000" required/>
                        </div>
                    </div>
                     <div className="form-group">
                        <label>Do you offer bonus in addition to monthly salary? <span className="required">*</span></label>
                        <div className="radio-group">
                            <label><input type="radio" name="hasBonus" checked={data.hasBonus === true} onChange={() => setFormData({...formData, hasBonus: true})}/> Yes</label>
                            <label><input type="radio" name="hasBonus" checked={data.hasBonus === false} onChange={() => setFormData({...formData, hasBonus: false})}/> No</label>
                        </div>
                    </div>
                     <div className="form-group">
                        <label>Job Info / Job Description <span className="required">*</span></label>
                        <textarea name="description" value={data.description} onChange={onChange} maxLength="350" required/>
                        <p className="field-hint">Remaining characters: {350 - data.description.length}</p>
                    </div>
                     <div className="form-group">
                        <label>Skills</label>
                        <input type="text" name="skills" value={data.skills} onChange={onChange} placeholder="Type to search for skills (comma separated)"/>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-section-header">Timings</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Job Timings <span className="required">*</span></label>
                            <textarea name="jobTimings" value={data.jobTimings} onChange={onChange} required/>
                        </div>
                         <div className="form-group">
                            <label>Interview Details <span className="required">*</span></label>
                            <textarea name="interviewDetails" value={data.interviewDetails} onChange={onChange} required/>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-section-header">About Your Company</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Company Name <span className="required">*</span></label>
                            <input type="text" name="companyName" value={data.companyName} onChange={onChange} placeholder="Eg. Eloquent info Solutions" required/>
                        </div>
                        <div className="form-group">
                            <label>Contact Person Name <span className="required">*</span></label>
                            <input type="text" name="contactPerson" value={data.contactPerson} onChange={onChange} placeholder="Eg. Nilesh" required/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone Number <span className="required">*</span></label>
                            <input type="text" name="contactPhone" value={data.contactPhone} onChange={onChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Email Id <span className="required">*</span></label>
                            <input type="email" name="contactEmail" value={data.contactEmail} onChange={onChange} placeholder="Eg. eloquent@gmail.com" required/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Contact Person Profile <span className="required">*</span></label>
                            <select name="contactPersonProfile" value={data.contactPersonProfile} onChange={onChange}>
                                <option>HR/Owner</option>
                                <option>Manager</option>
                                <option>Recruiter</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Size of Organization <span className="required">*</span></label>
                            <select name="organizationSize" value={data.organizationSize} onChange={onChange}>
                                <option>1-10</option>
                                <option>11-50</option>
                                <option>51-200</option>
                                <option>201+</option>
                            </select>
                        </div>
                    </div>
                     <div className="form-group">
                        <label>Job Address <span className="required">*</span></label>
                        <textarea name="jobAddress" value={data.jobAddress} onChange={onChange} placeholder="Please fill complete address, mention Landmark near your office" required/>
                    </div>
                     <div className="form-group">
                        <label>How often do you have a new job vacancy? <span className="required">*</span></label>
                         <select name="hiringFrequency" value={data.hiringFrequency} onChange={onChange}>
                            <option value="">Choose hiring frequency</option>
                            <option>Frequently</option>
                            <option>Occasionally</option>
                            <option>Rarely</option>
                        </select>
                    </div>
                </div>
                
                <button type="submit" className="btn" style={{width: '100%', padding: '1rem', fontSize: '1.2rem'}}>Submit</button>
            </form>
        </div>
    );
};

export default PostJobForm;