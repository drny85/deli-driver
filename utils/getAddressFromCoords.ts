interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Address {
  formattedAddress: string;
  // Add more properties as needed
}

const apiKey = '';

export async function getAddressFromCoords(coords: Coordinates): Promise<Address | null> {
  const { latitude, longitude } = coords;
  // Replace with your Google Maps API key

  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const results = await response.json();

    if (results && results.results) {
      return {
        formattedAddress: results.results[0].formatted_address,
        // Extract more details from results as needed
      };
    } else {
      return null; // No results found
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
}

// Example usage
const coordinates: Coordinates = {
  latitude: 40.7128,
  longitude: -74.006,
};

getAddressFromCoords(coordinates)
  .then((address) => {
    if (address) {
      console.log('Address:', address.formattedAddress);
    } else {
      console.log('No address found for the given coordinates.');
    }
  })
  .catch((err) => console.error('Error:', err));
