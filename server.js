"use strict";

const fastifyServer = require("./app")({});
const MyStreamSwitchManager = require("./stream_switch_manager");
const ChannelEngine = require("eyevinn-channel-engine");

const STITCH_ENDPOINT = process.env.STITCH_ENDPOINT || "http://lambda.eyevinn.technology/stitch/master.m3u8";
class MyAssetManager {
  constructor(opts) {

  }

  getNextVod(vodRequest) {
    return new Promise((resolve, reject) => {
      const payload = {
        uri: "https://maitv-vod.lab.eyevinn.technology/MORBIUS_Trailer_2020.mp4/master.m3u8",
        breaks: [
          // {
          //   pos: 0,
          //   duration: 105 * 1000,
          //   url: "https://maitv-vod.lab.eyevinn.technology/VINN.mp4/master.m3u8"
          // }
        ]
      };
      const buff = Buffer.from(JSON.stringify(payload));
      const encodedPayload = buff.toString("base64");
      const vod = {
        id: 1,
        title: "VINN",
        uri: STITCH_ENDPOINT + "?payload=" + encodedPayload
      }
      resolve(vod);
    });
  }
}

class MyChannelManager {
  getChannels() {
    return [{ id: "1", profile: this._getProfile() }];
  }

  _getProfile() {
    return [
      { bw: 6134000, codecs: 'avc1.4d001f,mp4a.40.2', resolution: [1024, 458] },
      { bw: 2323000, codecs: 'avc1.4d001f,mp4a.40.2', resolution: [640, 286] },
      { bw: 1313000, codecs: 'avc1.4d001f,mp4a.40.2', resolution: [480, 214] }
    ];
  }
}

// MAKE IT LISTEN
const run = async () => {
  try {
    const myAssetManager = new MyAssetManager();
    const myChannelManager = new MyChannelManager();
    const myStreamSwitchManager = new MyStreamSwitchManager();

    const engine = new ChannelEngine(myAssetManager, {
      heartbeat: "/",
      defaultSlateUri: "https://maitv-vod.lab.eyevinn.technology/slate-consuo.mp4/master.m3u8",
      averageSegmentDuration: 7200,
      channelManager: myChannelManager,
      streamSwitchManager: myStreamSwitchManager,
    });

    const port = process.env.VC_PORT || 8000

    engine.start();
    console.log("...VC listening on port " + port + `\n...Playback on: http://localhost:${port}/live/master.m3u8?channel=1 \n`);
    engine.listen(port);

    const address = await fastifyServer.listen(process.env.PORT || 8001, process.env.HOST || "0.0.0.0");
    console.log(`\n...Breaking News API is listening at ${address}\n`);

  } catch (err) {
    fastifyServer.log.error(err);
    process.exit(1);
  }
};

run();
