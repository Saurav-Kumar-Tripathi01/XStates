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
            .then((response) => response.json())
            .then((data) => setCountries(data))
            .catch((error) => console.error('Error fetching countries:', error));
    }, []);

    console.log(countries);

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

    console.log(states);

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

    console.log(cities);

    const handleCityChange = (city) => {
        setSelectedCity(city);
        setMessage(`You Selected ${city}, ${selectedState}, ${selectedCountry}`);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <h1>Select Location</h1>
            <div style={{
                display: 'flex',
                gap: '20px',
            }}>
                <div>
                    <select
                        id="country"
                        value={selectedCountry}
                        onChange={(e) => handleCountryChange(e.target.value)}
                    >
                        <option value="">-- Select Country --</option>
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
                        disabled={!selectedCountry}
                    >
                        <option value="">-- Select State --</option>
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
                        disabled={!selectedState}
                    >
                        <option value="">-- Select City --</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
            </div>

            {message && (
        <p style={{ marginTop: '20px', fontSize: '18px' }}>
          You selected <span style={{ fontWeight: 'bold', fontSize: '30px' }}>{selectedCity}</span>, 
          <span style={{ color: 'gray', fontWeight: 'bold' }}>{selectedState}</span>, 
          <span style={{ color: 'gray', fontWeight: 'bold' }}>{selectedCountry}</span>
        </p>
      )}
        </div>
    );
};

export default XProfile;