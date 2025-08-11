/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
// import { GOOGLE_PLACE_API_KEY } from '../constants';

export default async ({ latitude, longitude }) => {
    try {
        // const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACE_API_KEY}`;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        const response = await fetch(url);

        const data = await response.json();

        if (!data) {
            return new Error('No results found');
        }
        // if (data.results.length === 0) {
        //     return new Error('No results found');
        // }

        const address = data.display_name || '';
        const city = data.address.state_district || '';
        const { state } = data.address || '';
        const pincode = data.address.postcode || '';
        // const address = data.results[0].formatted_address;
        // const city = data.results[0].address_components.find((component) => component.types.includes('locality'))?.long_name;
        // const state = data.results[0].address_components.find((component) => component.types.includes('administrative_area_level_1'))?.long_name;
        // const pincode = data.results[0].address_components.find((component) => component.types.includes('postal_code'))?.long_name;

        return {
            address,
            city,
            state,
            pincode,
        };
    } catch (err) {
        return new Error('Error while getting location');
    }
};
