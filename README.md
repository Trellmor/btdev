# BerryTube development helpers

Contains 2 projects that help with developing applications for [BerryTube](http://berrytube.tv).

## btlog

Connects to [BerryTube](http://berrytube.tv) and logs alls messages to local json files. Use it to collect data for btdev.

### Setup

Install the dependencies with 

```
$ npm install
```

### Run

Start it on the console with

```
$ node log.js
```

To stop it, press `CTRL+C`

## btdev

Local BerryTube socket.io server and control interface. You can use it to send specific messages to connected clients for testing purposes.

### Setup

Install the dependencies with

```
$ npm install
```

**(Optional):** Use btlog to log messages first, then copy the json files to btdevs logs/ folder.

### Run

Start it on the console with

```
$ node server.js
```

Navigate to http://localhost:8344/ to control it. If you already added json files from btlog to the logs/ folder you can select and send them. You can also create, edit and delete messages.

Connect your application to \<yourhost\>:8344/ to test it.

