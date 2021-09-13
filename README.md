# breaking-news-vc

This Application is a Proof-of-Concept on how to use a Stream Switch Manager API with the Eyevinn Channel-Engine V3 Release Candidate, as its `StreamSwitchManager`. This API is a simple example implementation for a stream switch manager that enables a quick switch to a Live stream with a single API POST call. 

This could be used to emulate breaking into a live news coverage on top of a linear channel on Channel Engine, much like traditional TV. 

## Requirements
- Node v12+
- TBA
## Usage
- `git clone `
- `cd breaking-news-vc`
- `npm install`
- `npm start` to run the server
- Playback found on `http://localhost:8000/live/master.m3u8?channel=1`

### Usage: POST an Event with cURL
Try to POST a live event with (add your own start/end times):
```
curl -X 'POST' \
  'http://localhost:8001/api/v1/breaking' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "channelId": "1",
  "event": {
    "eventId": "aaaa-1234-bbbb-1234-cccc-1234",
    "assetId": "asset_44",
    "title": "Breaking News 9/12/2021: Tears of Steel Live 24/7!",
    "type": 1,
    "start_time": <add unix timestamp here>,
    "end_time": <add unix timestamp here>,
    "uri": "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
    "duration": <optional with when using type=1>
  }
}'
```

## Environment variables
- `HOST`: Desired host, default -> localhost
- `PORT`: Desired port, default -> 8001

## API Interfaces

### Breaking News API Interface

The Channel Engine expects that the Stream Switch Manager API implements the following interface

Resource | Method | Request Payload | Response Payload | Description
-------- | ------ | --------------- | ---------------- | -----------
/breaking | POST | EVENT JSON | n/a | Add event data to a channel specific schedule list.
/schedule | GET | n/a | LIST of EVENT JSON | Return all schedule lists. Lists containing EVENT objects.
/schedule/:channelId | GET | n/a | LIST of EVENT JSON LISTS | Return a schedule list for a particular channel. A list containing EVENT objects.
/schedule/:channelId | DELETE | n/a | LIST of EVENT JSON | Delete a list for a particular channel.

## Docker 
- Coming Soon