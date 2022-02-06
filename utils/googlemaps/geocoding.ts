

const geocodingApiKey = "AIzaSyCUBupiI9nCBQD9X4Mhch0ilHQI9sSg2Gw";


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