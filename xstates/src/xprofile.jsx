import React, { useState, useEffect } from 'react';

const XProfile = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('https://crio-location-selector.onrender.com/countries')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP status ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setCountries(data))
            .catch((error) => {
                console.error('Error fetching countries:', error);
                setCountries([]); // Clear dropdown
                setMessage('Unable to load countries. Please try again later.');
            });
    }, []);

    const handleCountryChange = (country) => {
        setSelectedCountry(country);
        setSelectedState('');
        setSelectedCity('');
        setMessage('');
        setStates([]);
        setCities([]);

        fetch(`https://crio-location-selector.onrender.com/country=${country}/states`)
            .then((response) => response.json())
            .then((data) => setStates(data))
            .catch((error) => console.error('Error fetching states:', error));
    };

    const handleStateChange = (state) => {
        setSelectedState(state);
        setSelectedCity('');
        setMessage('');
        setCities([]);

        fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`)
            .then((response) => response.json())
            .then((data) => setCities(data))
            .catch((error) => console.error('Error fetching cities:', error));
    };

    const handleCityChange = (city) => {
        setSelectedCity(city);
        setMessage(`You selected ${city}, ${selectedState}, ${selectedCountry}`);
    };

    return (
        <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h1>Select Location</h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <div>
                    <select
                        id="country"
                        value={selectedCountry}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        aria-label="Select Country"
                        style={{ padding: '5px', width: '150px' }}
                    >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <select
                        id="state"
                        value={selectedState}
                        onChange={(e) => handleStateChange(e.target.value)}
                        aria-label="Select State"
                        style={{ padding: '5px', width: '150px' }}
                        disabled={!selectedCountry}
                    >
                        <option value="">Select State</option>
                        {states.map((state) => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <select
                        id="city"
                        value={selectedCity}
                        onChange={(e) => handleCityChange(e.target.value)}
                        aria-label="Select City"
                        style={{ padding: '5px', width: '150px' }}
                        disabled={!selectedState}
                    >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
            </div>

            {message && (
                <p id={message.includes('Unable') ? 'error-message' : 'location-message'} style={{ marginTop: '20px', color: message.includes('Unable') ? 'red' : 'black' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default XProfile;
