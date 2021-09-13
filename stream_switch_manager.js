const DBAdapter = require('./src/db/memory-db-adapter');
const Session = require('./src/api/Session');

class MyStreamSwitchManager {
    constructor() {
        this.schedule = [];
    }

    generateID() {
        return uuidv4();
    }

    getSchedule() {
        const channelId = 1;
        const schedule = DBAdapter.getSession(channelId);
        this.schedule = schedule ? schedule.getSchedule() : [];
        return this.schedule;  
    }
}

module.exports = MyStreamSwitchManager;