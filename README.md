# Redis Chat Challenge
Two day [Hackathon](https://rb-hackfest.devpost.com/) challenge to create real-time chat application using Redis. :boom:

## Vercel + Heroku deployment
https://redis-chat-challenge-ll7n94qro-iammar7.vercel.app

> If you face issues with **WebSockets** on the above URL, then please try to refresh the Heroku server here https://api-redis-chat-challenge.herokuapp.com

## Features
- Real-time chat with all the connected users :rainbow:
- NodeJS server with **Redis** and **Socket IO** integration :customs:
- Server deployment on **Heroku** :fire:
- Frontend deployment on **Vercel** :fire:
- **Automatic deployment** on both platforms :runner:
- Create custom channel feature.
- Search in chat feature.
- Participant count feature.
 
## Technologies
- React <img alt="react" src="https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white" />
- Node <img alt="Nodejs" src="https://img.shields.io/badge/-Nodejs-43853d?style=flat-square&logo=Node.js&logoColor=white" />
- Express <img alt="Express" src="https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white" />
- Socket.io <img alt="Socket.io" src="https://img.shields.io/badge/-Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white" />
- Redis <img alt="Redis" src="https://img.shields.io/badge/-Redis-DC382D?style=flat-square&logo=redis&logoColor=white" />
- Heroku <img alt="Heroku" src="https://img.shields.io/badge/-Heroku-430098?style=flat-square&logo=heroku&logoColor=white" />
- Vercel <img alt="vercel" src="https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />

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
