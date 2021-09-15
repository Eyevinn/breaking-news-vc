
const logger = require('../logger.js');
const { v4: uuidv4 } = require('uuid');
const DBAdapter = require('../db/memory-db-adapter');
const Session = require('./Session.js');

const EventSchema = () => ({
  description: "Events description",
  type: "object",
  properties: {
    eventId: {
      type: "string",
      description: "Unique ID for event. If not given then a UUID will be generated.",
      example: "1",
    },
    assetId: {
      type: "string",
      description: "ID of the asset.",
      example: "asset-1",
    },
    title: {
      type: "string",
      description: "title of the event.",
      example: "Breaking News 9/12/2021: A Miracle on 44th Street!",
    },
    type: {
      type: "number",
      description: "Type of event. 1=Live | 2=Vod",
      example: "1",
    },
    start_time: {
      type: "number",
      description: "Event start time in unix timestamp in milliseconds",
      example: "1631169945698",
    },
    end_time: {
      type: "number",
      description: "Event end time in unix timestamp in milliseconds",
      example: "1631170000000",
    },
    uri: {
      type: "string",
      description: "URI for the Event content in HLS format",
      example: "https://mock.mock.eyevinn/live-stream/master.m3u8",
    },
    duration: {
      type: "number",
      description: "Desired duration of the Event content in milliseconds (for VOD events only)",
      example: "https://mock.mock.eyevinn/vod/master.m3u8",
    },
  },
  example: {
    eventId: "asbc-24220210419100240",
    assetId: "asset123",
    title: "My Breaking News Live Stream",
    type: 1,
    start_time: Date.now(),
    end_time: Date.now() + 120 * 1000,
    uri: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
    duration: 120000,
  },
});

const BadRequestSchema = (exampleMsg) => ({
  description: "Bad request error description",
  type: "object",
  properties: {
    message: { type: "string", description: "Reason of the error" },
  },
  example: {
    message: exampleMsg,
  },
  xml: {
    name: "xml",
  },
});

// Dictionary of Schemas.
const schemas = {
  "GET/schedules": {
    description: "Gets Schedule List of All Posted Events from all Channels",
    tags: ["schedule"],
    response: {
      200: {
        description: "On success returns an array of events",
        type: "array",
        items: { 
          type: "array",
          items: EventSchema(),
        }
      },
    },
    security: [{ apiKey: [] }],
  },
  "GET/schedule/:channelId": {
    description: "Gets Schedule List of All Posted Events for specified channel",
    tags: ["schedule"],
    params: {
      channelId: {
        type: "string",
        description: "The ID for the channel",
      },
    },
    response: {
      200: {
        description: "On success returns an array of events",
        type: "array",
        items: EventSchema(),
      },
    },
    security: [{ apiKey: [] }],
  },
  'DELETE/schedule/:channelId': {
    description: "Deletes the schedule for a channel",
    params: {
      channelId: { type: "string", description: "an identifier for the channel to delete schedule from." }
    },
    security: [
      { apiKey: [] }
    ],
    response: {
      204: {},
      404: BadRequestSchema(),
    }
  },
  'POST/breaking': {
    description: "Creates a Live Event and adds it to the schedule list.",
    body: {
      type: "object",
      properties: {
        channelId: { type: "string", description: "identifier for linear channel in channel-engine"},
        event: {
          type: "object",
          properties: {
            eventId: { type: "string", description: "a unique identifier for the event object." },
            assetId: { type: "string", description: "an identifier for the asset." },
            title: { type: "string", description: "title of the event." },
            type: { type: "number", description: "an integer [1|2], '1' for Live stream events and '2' for VOD events." },
            start_time: { type: "number", description: "event starting time. An integer of a unix timestamp in milliseconds." },
            end_time: { type: "number", description: "event ending time. An integer of a unix timestamp in milliseconds." },
            uri: { type: "string", description: "URI to the event's master m3u8-file." },
            duration: { type: "number", description: "an integer for the event duration in seconds."}
          }
        }
      },
      example: {
        channelId: "1",
        event: {
          eventId: "aaaa-1234-bbbb-1234-cccc-1234",
          assetId: "asset_44",
          title: "Breaking News 9/12/2021: Tears of Steel Live 24/7!",
          type: 1,
          start_time: Date.now(),
          end_time: Date.now() + 5 * 60 * 1000,
          uri: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
          duration: 5 * 60 * 1000
        }
      }
    },
    response: {
      200: {
        channelId: { type: "string", example: "1" },
        event: EventSchema()
      },
      409: BadRequestSchema(),
    },
    security: [
      { apiKey: [] }
    ]
  },
}

// ======================
// ====  API ROUTES  ====
// ======================
module.exports = (fastify, opt, next) => {
  fastify.get(
    "/schedule",
    { schema: schemas["GET/schedules"] },
    async (request, reply) => {
      try {
        const sessionList = await DBAdapter.getAllSessions();
        const allSchedules = sessionList.map( session => session.getSchedule() );
        reply.code(200).send(allSchedules);
      } catch (exc) {
        logger.error(exc, { label: request.headers['host'] });
        reply.code(500).send({ message: exc.message });
      }
    }
  );

  fastify.get(
    "/schedule/:channelId",
    { schema: schemas["GET/schedule/:channelId"] },
    async (request, reply) => {
      try {
        const session = await DBAdapter.getSession(request.params.channelId);
        if(!session) {
          reply.code(404).send({message: "Schedule for Channel with specifed ID was not found."});
        }
        reply.code(200).send(session.getSchedule());
      } catch (exc) {
        logger.error(exc, { label: request.headers['host'], chId: request.params.channelId });
        reply.code(500).send({ message: exc.message });
      }
    }
  );

  fastify.delete('/schedule/:channelId', { schema: schemas['DELETE/schedule/:channelId'] }, async (request, reply) => {
    try {
      logger.info(request.params);
      let session = await DBAdapter.getSession(request.params.channelId);
      if (!session) {
        reply.code(404).send({ message: `Channel with ID ${request.params.channelId} was not found` });
      } else {
        await DBAdapter.DeleteSession(request.params.channelId);
        reply.send(204);
      }
    } catch (exc) {
      logger.error(exc, { label: request.headers['host'], chId: request.params.channelId });
      reply.code(500).send({ message: exc.message });
    }
  });

  fastify.post('/breaking', { schema: schemas['POST/breaking'] }, async (request, reply) => {
    try {
      
      logger.info(request.body, { label: request.headers['host'], chId: request.body.channelId });
      
      if (!request.body.channelId || !request.body.event) {
        reply.code(400).send({ message: "Request body missing channelId or event object" });
      }
      if (!request.body.event['uri'] || !request.body.event['start_time'] || !request.body.event['end_time'] || !request.body.event['type']) {
        reply.code(400).send({ message: "Request body missing required fields in object." });
      }
      const channelId =  request.body.channelId;
      const eventObject = {
        eventId: request.body.event['eventId'] || uuidv4(),
        assetId: request.body.event['assetId'] || "unknown",
        title: request.body.event['title'] || "untitled",
        type: request.body.event['type'] || null,
        start_time: request.body.event['start_time'] || null,
        end_time: request.body.event['end_time'] || null,
        uri: request.body.event['uri'] || null,
        duration: request.body.event['duration'] || null,
      }

      let session = await DBAdapter.getSession(channelId);
      if (!session) {
        session = new Session(channelId);
      }
      session.AddEventToSchedule(eventObject);
      await DBAdapter.AddSessionToStorage(session);

      reply.code(200).send({ channelId: channelId, event: eventObject });
    } catch (exc) {
      logger.error(exc, { label: request.headers['host'], chId: request.params.channelId });
      reply.code(500).send({ message: exc.message });
    }
  });

  next();
};
