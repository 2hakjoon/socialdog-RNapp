
interface GetAddressFromLatLng {
  lat: number,
  lng:number,
}

export const getAddressFromLatLng = async ({lat,lng}:GetAddressFromLatLng) =>{
  return '테스트용 주소지'
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ko&key=${process.env.GOOGLE_GEOCODING_API_KEY}`)
  const json = await response.json()
  //console.log(json)
  const [_,country, city] = json.plus_code.compound_code.split(' ')
  return country+" "+city 
}