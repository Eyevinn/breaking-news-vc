

class Session {
  constructor(channelId) {
    // Take a time stamp.
    const timeStamp = new Date().toISOString();
    this.created = timeStamp;
    this.sessionId = channelId || null;
    this.schedule = [];
    console.log("::::BOOYAA::: IM BORN::::::")
  }

  getID() {
    return this.sessionId;
  }

  getCreated(){
    return this.created;
  }

  getSchedule() {
    return this.schedule;
  }
  
  AddEventToSchedule(event){
    return this.schedule.push(event);
  }

}

module.exports = Session;
