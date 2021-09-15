# breaking-news-vc

This Application is a Proof-of-Concept on how to use a Stream Switch Manager API with the **Eyevinn Channel-Engine V3 Release Candidate**, as its `StreamSwitchManager`. This API is a simple example implementation for a stream switch manager that enables a quick switch to a Live stream with a single API POST call. 

This could be used to emulate breaking into a live news coverage on top of a linear channel on Channel Engine, much like traditional TV. 

## Requirements
- nodejs v10+
- Docker (optional)
## Usage
- `git clone https://github.com/Eyevinn/breaking-news-vc.git`
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
    "start_time": <(In ms) add unix timestamp here>,
    "end_time": <(In ms) add unix timestamp here>,
    "uri": "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
    "duration": <(In ms) optional with when using type=1>
  }
}'
```

## Environment variables
- `HOST`: Desired API host, default -> localhost
- `VC_PORT`: Desired port for channel engine instance, default -> 8000
- `API_PORT`: Desired port for Breaking News API, default -> 8001


## Docker Container
To build the Docker container:

` docker build -t breaking-news-api:local .`

To run the Docker container with default environment variables run:

`docker run --rm -p 8000-8001:8000-8001 -e VC_PORT=8000 -e API_PORT=8001 --name breaking_news_poc breaking-news-api:local`

### Docker-Compose
A docker-compose config file is provided that takes care of building the image and running this container.

Start the service:

- `docker-compose up`

Stop the service:

- `docker-compose down`


## Breaking News API Interface

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
