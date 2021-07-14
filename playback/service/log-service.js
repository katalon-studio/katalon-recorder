class Logger {
  constructor() {
  }

  info(message){
    console.info(message);
  }

  error(message){
    console.error(message);
  }

  log(message){
    console.log(message);
  }

  logTime(){
    let now = new Date();
    console.info("Time: " + now + " Timestamp: " + now.getTime());
  }

}


const logger = new Logger();
export {logger}