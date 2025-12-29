import fs from "node:fs";
import mongoose from "mongoose";
import { User, Channel, Video, Comment } from "./models/index.js";
import { getEnvVar } from "./utils/env.js";
import { hashPassword } from "./utils/password.js";

const DB_URL = getEnvVar("DB_URL");
const data = JSON.parse(fs.readFileSync("./youtube_data.json", "utf-8"));

// Generates a random date between two dates
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

async function seed() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to DB");

    // clear existing data
    await Promise.all([
      User.deleteMany({}),
      Channel.deleteMany({}),
      Video.deleteMany({}),
      Comment.deleteMany({}),
    ]);

    const user = await User.create({
      username: "testuser",
      email: "user@test.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=testuser",
      password: await hashPassword("Testing123"),
    });

    const userCache = new Map();

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    console.log(`Seeding ${data.length} channels...`);
    for (const chan of data) {
      const chanCreatedAt = randomDate(
        oneYearAgo,
        new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
      );
      const newChannel = await Channel.create({
        userId: user._id,
        name: chan.name,
        description: chan.description,
        avatar: chan.avatar,
        banner: chan.banner,
        createdAt: chanCreatedAt,
        updatedAt: chanCreatedAt,
      });

      for (const vid of chan.videos) {
        const videoCreatedAt = randomDate(chanCreatedAt, now);

        const newVideo = await Video.create({
          channelId: newChannel._id,
          title: vid.title,
          description: vid.description,
          videoUrl: vid.videoUrl,
          thumbnailUrl: vid.thumbnail,
          views: vid.views,
          likes: vid.likes,
          category: vid.category,
          createdAt: videoCreatedAt,
          updatedAt: videoCreatedAt,
        });

        newChannel.videos.push(newVideo._id);

        for (const comm of vid.comments) {
          const commentCreatedAt = randomDate(videoCreatedAt, now);
          const authorUsername = comm.author;

          let commenterId;

          // 2. Check if we already created this user in this session
          if (userCache.has(authorUsername)) {
            commenterId = userCache.get(authorUsername);
          } else {
            // 3. Check the DB
            let existingUser = await User.findOne({ username: authorUsername });

            if (!existingUser) {
              // 4. Create new user
              const newUser = await User.create({
                username: authorUsername,
                avatar: comm.avatar,
                email: `${authorUsername
                  .replace(/[@\s]/g, "")
                  .toLowerCase()}${Math.floor(Math.random() * 10000)}@test.com`,
                createdAt: randomDate(oneYearAgo, commentCreatedAt),
              });
              existingUser = newUser;
            }

            // Save to cache and use the ID
            userCache.set(authorUsername, existingUser._id);
            commenterId = existingUser._id;
          }

          // 5. Create the comment using the commenterId
          await Comment.create({
            videoId: newVideo._id,
            userId: commenterId,
            content: comm.text,
            createdAt: commentCreatedAt,
            updatedAt: commentCreatedAt,
          });
        }
      }

      await newChannel.save();
    }

    await user.save();

    console.log("Seeding successful");
    process.exit(0);
  } catch (err) {
    console.error("Seeding Error: ", err);
    process.exit(1);
  }
}

seed();
