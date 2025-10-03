import React from 'react';

const SearchBar = () => {
    return (
        <div style={{ marginBottom: '2rem' }}>
            <input 
                type="text" 
                placeholder="Find New Job (e.g., 'React Developer in New York')" 
                style={{width: '100%', padding: '1rem', fontSize: '1.2rem'}}
            />
        </div>
    );
};

export default SearchBar;
