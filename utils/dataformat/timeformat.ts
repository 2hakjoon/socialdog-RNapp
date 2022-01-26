

export const Oneday = 86400000;

export const timerFormat = (time:number) => {
  let formatedTime = ""

  formatedTime += Math.floor(time/3600) + ":";
  time = time%3600;

  if(time/60 < 10){
    formatedTime += 0
  }
  formatedTime += Math.floor(time/60) + ":";
  time = time % 60


  if(time%60 < 10){
    formatedTime += 0
  }
  formatedTime += Math.floor(time%60);

  return formatedTime
}

export const timerFormatKor = (time:number) => {
  let formatedTime = ""

  if(time>3600){
    formatedTime += Math.floor(time/3600) + "시간";
    time = time%3600;
  }

  if(time>60){
    formatedTime += Math.floor(time/60) + "분";
    time = time % 60
  }

  formatedTime += Math.floor(time%60) + "초";
  console.log(formatedTime)

  return formatedTime
}

export const formatAmPmHour = (hour:number) => {
  console.log(hour)
  let formatedTime='';
  if(hour<12){
    formatedTime += "오전 "
    formatedTime += hour
  }
  else if(hour === 12){
    formatedTime += "오후 "
    formatedTime += hour
  }
  else{
    formatedTime += "오후 "
    formatedTime += hour - 12
  }
  formatedTime += "시"
  return formatedTime;
}

export const formatWalkingTime = (seconds:number)=>{
  if(seconds<60){
    return "(1분 미만)"
  }
  if(seconds>60 && seconds<3600){
    const string = `(산책시간 : ${Math.floor(seconds / 60)}분)`
    return string
  }
  if(seconds>3600){
    let string = `(산책시간 : ${Math.floor(seconds / 3600)}시간 `
    string += `${Math.floor((seconds % 3600)/60)}분)`
    return string
  }
}