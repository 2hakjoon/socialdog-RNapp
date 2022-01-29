

const geocodingApiKey = "AIzaSyAFJ3P-P0iEmZ8-qUS8B5cXiT_YkYcD_fk";

interface GetAddressFromLatLng {
  lat: number,
  lng:number,
}

export const getAddressFromLatLng = async ({lat,lng}:GetAddressFromLatLng) =>{
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ko&key=${geocodingApiKey}`)
  const json = await response.json()
  //console.log(json)
  const [_,country, city] = json.plus_code.compound_code.split(' ')
  return country+" "+city 
}