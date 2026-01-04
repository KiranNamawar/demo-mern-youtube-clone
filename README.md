# YouTube Clone

A full-stack YouTube clone application that replicates core YouTube features including video browsing, user authentication, channel management, and interactive video playback with comments.

## Features

- **User Authentication** - Register and login with JWT-based authentication
- **Video Browsing** - Browse videos with search and category filters
- **Video Player** - Watch videos with like/dislike and comment functionality
- **Channel Management** - Create and manage your own channel
- **Video Upload** - Upload, edit, and delete videos from your channel
- **Comments** - Add, edit, and delete comments on videos
- **Subscriptions** - Subscribe to channels and view subscriptions
- **Responsive Design** - Fully responsive UI for mobile, tablet, and desktop

## Technologies Used

- React
- Tailwind CSS
- React Router
- Redux Toolkit
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT

## Links

- [Github](https://github.com/KiranNamawar/demo-mern-youtube-clone)

## Setup

- Clone the repository
```bash
git clone https://github.com/KiranNamawar/demo-mern-youtube-clone.git
cd demo-mern-youtube-clone
```

### Running Server

```bash
cd server
```

- Install dependencies
```bash
npm install
```

- Copy .env.example to .env and fill in the values
```bash
cp .env.example .env
```

- Start Database with Docker (optional if you have mongodb installed)
```bash
npm run db:start
```

- Seed Database
```bash
npm run db:seed
```

- Start Server
```bash
npm run dev
```

### Running Client (in second terminal window)

```bash
cd client
```

- Install dependencies
```bash
npm install
```

- Start Client
```bash
npm run dev
```

- Open [http://localhost:5173](http://localhost:5173) to view it in the browser.