import Config from 'react-native-config';

interface GetAddressFromLatLng {
  lat: number;
  lng: number;
}

export const getAddressFromLatLng = async ({
  lat,
  lng,
}: GetAddressFromLatLng) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ko&key=${Config.GOOGLE_GEOCODING_API_KEY}`,
  );
  //console.log(response);
  const json = await response.json();
  //console.log(json);
  const [_, country, province, city] = json.plus_code.compound_code.split(' ');
  return country + ' ' + province + ' ' + city;
};
