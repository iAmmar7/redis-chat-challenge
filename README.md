# Redis Chat Challenge
This is a real-time chat application that we built in a two day Hackathon.

## How to tun
You need to have **Docker** and **NodeJS** installed in your machine.

### Clone Repository

```bash
$ git clone https://github.com/iAmmar7/redis-chat-challenge.git

```

### Install Dependencies

```bash
$ cd <Project-Path>

$ npm i && cd client && npm i

```

### Initiate a docker container
```bash
$ sudo docker-compose up -d
```

### Fill some dummy data using our script
```bash
$ cd data_loader
$ npm install
$ npm start
```

### Run the server
Run the following command in the root directory
```bash
$ npm start
```

### Run the client
```bash
$ cd client
$ npm start
```



## Technologies we used

### Backend

- NodeJs
- Express
- Redis
- SocketIO

### Frontend

- React
- SocketIO-Client
