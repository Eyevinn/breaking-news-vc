const DBAdapter = require("./db-adapter");

SESSION_STORE = {};

class MemoryDBAdapter extends DBAdapter {
    
  async AddSessionToStorage(session) {
    SESSION_STORE[session.sessionId] = session;
    return 1;
  }

  async getAllSessions(opt) {
    let sessionList = Object.values(SESSION_STORE);
    return sessionList;
  }

  async getSession(sessionId) {
    const session = SESSION_STORE[sessionId];
    return session;
  }

  async DeleteSession(sessionId) {
    delete SESSION_STORE[sessionId];
    return 1;
  }
}

const adapter = new MemoryDBAdapter();

module.exports = adapter;
