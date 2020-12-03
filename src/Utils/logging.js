import LogRocket from "logrocket"

export default function consoleLog(log, type = 'log') {
  if (process.env.NODE_ENV === "development") {
      if(type === 'log')
      {
        console.log(log)
      }else if (type === 'info')
      {
        console.info(log)
      }else if (type === 'warn')
      {
        console.warn(log)          
      }else if (type === 'debug')
      {
        console.debug(log)          
      }else if (type === 'error')
      {
        console.error(log)          
      }
  } else {
    if(type === 'log')
    {
      LogRocket.log(log)
    }else if (type === 'info')
    {
      LogRocket.info(log)
    }else if (type === 'warn')
    {
      LogRocket.warn(log)          
    }else if (type === 'debug')
    {
      LogRocket.debug(log)          
    }else if (type === 'error')
    {
      LogRocket.error(log)          
    }
}
}
