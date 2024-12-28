import React, { useState, useEffect } from 'react';

const XProfile = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch countries on component mount
    useEffect(() => {
        fetch('https://crio-location-selector.onrender.com/countries')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch countries');
                }
                return response.json();
            })
            .then((data) => {
                setCountries(data);
                setError('');
            })
            .catch(() => {
                setError('Unable to load countries. Please try again later.');
                setCountries([]);
            })
            .finally(() => setLoading(false));
    }, []);

    // Synchronize the message whenever the location selection changes
    useEffect(() => {
        if (selectedCity && selectedState && selectedCountry) {
            setMessage(`You selected ${selectedCity}, ${selectedState}, ${selectedCountry}`);
        } else {
            setMessage('');
        }
    }, [selectedCity, selectedState, selectedCountry]);

    const handleCountryChange = (country) => {
        setSelectedCountry(country);
        setSelectedState('');
        setSelectedCity('');
        setMessage('');
        setStates([]);
        setCities([]);
        setError('');

        fetch(`https://crio-location-selector.onrender.com/country=${country}/states`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch states');
                }
                return response.json();
            })
            .then((data) => setStates(data))
            .catch(() => setError('Unable to load states. Please try again later.'));
    };

    const handleStateChange = (state) => {
        setSelectedState(state);
        setSelectedCity('');
        setMessage('');
        setCities([]);
        setError('');

        fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch cities');
                }
                return response.json();
            })
            .then((data) => setCities(data))
            .catch(() => setError('Unable to load cities. Please try again later.'));
    };

    const handleCityChange = (city) => {
        setSelectedCity(city);
    };

    return (
        <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h1>Select Location</h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <div>
                    {loading && <p>Loading countries...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <select
                        id="country"
                        value={selectedCountry}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        aria-label="Select Country"
                        style={{ padding: '5px', width: '150px' }}
                        disabled={loading || !!error}
                    >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
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
                        disabled={!selectedCountry || !!error}
                    >
                        <option value="">Select State</option>
                        {states.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
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
                        disabled={!selectedState || !!error}
                    >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {message && (
                <p style={{ marginTop: '20px', fontSize: '18px' }}>
                    You selected{' '}
                    <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{selectedCity}</span>,
                    <span style={{ color: 'gray' }}>{selectedState}</span>,
                    <span style={{ color: 'gray' }}>{selectedCountry}</span>
                </p>
            )}
        </div>
    );
};

export default XProfile;
