

export const authHeader = (accessToken:string | undefined)=>{
  if (accessToken){
    return{
      context: { 
        headers: { 
          "authorization": `Bearer ${accessToken}`
        } 
      },
    }
  }
  return{
    context: { 
      headers: { 
        "authorization": ``
      } 
    },
  }
}