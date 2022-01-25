


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
    if(time/60 < 10){
      formatedTime += 0
    }
    formatedTime += Math.floor(time/60) + "분";
    time = time % 60
  }

  if(time%60 < 10){
    formatedTime += 0
  }
  formatedTime += Math.floor(time%60) + "초";
  console.log(formatedTime)

  return formatedTime
}

