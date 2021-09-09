# breaking-news-vc

This Application to be used together with the Eyevinn Channel-Engine V3 as its `StreamSwitchManager`. This API is a simple example implementation for a stream switch manager that enables
a quick switch to a Live stream with a single API call. 

This could be used to emulate breaking into a live news coverage on top of a linear channel on Channel Engine, much like traditional TV. 

## API Interfaces

### Breaking News API Interface

The Channel Engine expects that the Stream Switch Manager API implements the following interface

Resource | Method | Request Payload | Response Payload | Description
-------- | ------ | --------------- | ---------------- | -----------
/breaking | POST | EVENT JSON | n/a | Add event data to a channel specific schedule list.
/schedule | GET | n/a | LIST of EVENT JSON | Return all schedule lists. Lists containing EVENT objects.
/schedule/:channelId | GET | n/a | LIST of EVENT JSON LISTS | Return a schedule list for a particular channel. A list containing EVENT objects.
/schedule/:channelId | DELETE | n/a | LIST of EVENT JSON | Delete a list for a particular channel.
