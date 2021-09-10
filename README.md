# breaking-news-vc

This Application to be used together with the Eyevinn Channel-Engine V3 as its `StreamSwitchManager`. This API is a simple example implementation for a stream switch manager that enables
a quick switch to a Live stream with a single API call. 

This could be used to emulate breaking into a live news coverage on top of a linear channel on Channel Engine, much like traditional TV. 

## Requirements
- Node v12+
- TBA
- 
## Usage
- `git clone https://github.com/Eyevinn/breaking-news-vc.git`
- `cd breaking-news-vc`
- `npm install`
- `npm start` to run the server

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

#### POST Object Example
```
{
  "channelId": "1",
  "event": {
    "eventId": "aaaa-1234-bbbb-1234-cccc-1234",
    "assetId": "asset_44",
    "title": "Breaking News 9/12/2021: A Miracle in Disneyland!",
    "type": 1,
    "start_time": 1631290137166,
    "end_time": 1631435137166,
    "uri": "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
    "duration": 30000
  }
}
```
## Swagger Documentation
Once server is up and running go to endpoint -> `http://localhost:8001/api/docs/` (depending on what HOST:PORT you chose)
to view the swagger style documentation. 

## Docker 
- Coming Soon
