import axios from "axios";

const fetchStates = async (countryCode) => {
    const result = {};
    try {
        const response = await axios.get(`http://api.geonames.org/childrenJSON?geonameId=${countryCode}&username=kode`);
        result.success = true;
        result.response = response;
    } catch (error) {
        console.error('Failed to fetch states:', error);
        result.success = false;
    }
    return result;
};

const fetchCities = async (stateCode) => {
    const result = {};
    try {
        const response = await axios.get(`http://api.geonames.org/childrenJSON?geonameId=${stateCode}&username=kode`);
        result.success = true;
        result.response = response;
    } catch (error) {
        console.error('Failed to fetch cities:', error);
    }
    return result;
};

const fetchCountries = async () => {
    const result = {};
    try {
        const response = await axios.get('http://api.geonames.org/countryInfoJSON?username=kode');
        result.success = true;
        result.response = response;
    } catch (error) {
        console.error('Failed to fetch countries:', error);
        result.success = false;
    }
    return result;
};

export { fetchStates, fetchCities, fetchCountries };
