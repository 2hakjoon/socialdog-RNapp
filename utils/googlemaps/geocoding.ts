import Config from 'react-native-config';

interface GetAddressFromLatLng {
  lat: number;
  lng: number;
}

export const getAddressFromLatLng = async ({
  lat,
  lng,
}: GetAddressFromLatLng) => {
  const geoCodingApiKey = 'AIzaSyCUBupiI9nCBQD9X4Mhch0ilHQI9sSg2Gw';
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ko&key=${geoCodingApiKey}`,
  );
  //console.log(response);
  const json = await response.json();
  //console.log(json);
  const [_, country, city] = json.plus_code.compound_code.split(' ');
  return country + ' ' + city;
};
