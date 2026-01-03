import fs from "node:fs";
import mongoose from "mongoose";
import { User, Channel, Video, Comment } from "./models/index.js";
import { getEnvVar } from "./utils/env.js";
import { hashPassword } from "./utils/password.js";

const DB_URL = getEnvVar("DB_URL");
const data = JSON.parse(fs.readFileSync("./seed_data.json", "utf-8"));

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

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Channel.deleteMany({}),
            Video.deleteMany({}),
            Comment.deleteMany({}),
        ]);
        console.log("Cleared existing data");

        const now = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        // Step 1: Create all users (including test user)
        console.log(`Creating ${data.users.length + 1} users...`);

        const testUser = await User.create({
            username: "testuser",
            email: "user@test.com",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=testuser",
            password: await hashPassword("Testing123"),
            createdAt: oneYearAgo,
        });

        const usernameToId = new Map();
        usernameToId.set("testuser", testUser._id);

        // Create users from seed data
        for (const userData of data.users) {
            const user = await User.create({
                username: userData.username,
                email: userData.email,
                avatar: userData.avatar,
                password: userData.password, // Already hashed in seed data
                createdAt: randomDate(oneYearAgo, now),
            });
            usernameToId.set(userData.username, user._id);
        }
        console.log(`✅ Created ${usernameToId.size} users`);

        // Step 2: Create channels
        console.log(`Creating ${data.channels.length} channels...`);

        const youtubeChannelIdToMongoId = new Map();
        const channelVideosMap = new Map(); // Track videos per channel for later

        for (const channelData of data.channels) {
            const chanCreatedAt = randomDate(
                oneYearAgo,
                new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
            );

            // Convert subscriber usernames to user IDs
            const subscriberIds = channelData.subscribers
                .map(username => usernameToId.get(username))
                .filter(id => id !== undefined);

            const newChannel = await Channel.create({
                userId: testUser._id, // Assign all channels to test user
                handle: channelData.handle,
                name: channelData.name,
                description: channelData.description,
                avatar: channelData.avatar,
                banner: channelData.banner,
                subscribers: subscriberIds,
                videos: [], // Will be populated later
                createdAt: chanCreatedAt,
                updatedAt: chanCreatedAt,
            });

            youtubeChannelIdToMongoId.set(channelData.youtubeChannelId, newChannel);
            channelVideosMap.set(newChannel._id.toString(), []);
        }
        console.log(`✅ Created ${data.channels.length} channels`);

        // Step 3: Create videos
        console.log(`Creating ${data.videos.length} videos...`);

        const youtubeVideoIdToMongoId = new Map();

        for (const videoData of data.videos) {
            const channel = youtubeChannelIdToMongoId.get(videoData.youtubeChannelId);

            if (!channel) {
                console.warn(`⚠️  Channel not found for video: ${videoData.title}`);
                continue;
            }

            const videoCreatedAt = videoData.publishedAt
                ? new Date(videoData.publishedAt)
                : randomDate(channel.createdAt, now);

            const newVideo = await Video.create({
                channelId: channel._id,
                title: videoData.title,
                description: videoData.description,
                videoUrl: videoData.videoUrl,
                thumbnailUrl: videoData.thumbnail,
                views: videoData.views,
                likes: videoData.likes,
                category: videoData.category,
                createdAt: videoCreatedAt,
                updatedAt: videoCreatedAt,
            });

            youtubeVideoIdToMongoId.set(videoData.youtubeVideoId, newVideo._id);
            channelVideosMap.get(channel._id.toString()).push(newVideo._id);
        }
        console.log(`✅ Created ${data.videos.length} videos`);

        // Step 4: Update channels with their video IDs
        console.log("Linking videos to channels...");
        for (const [channelId, videoIds] of channelVideosMap.entries()) {
            await Channel.findByIdAndUpdate(channelId, { videos: videoIds });
        }
        console.log("✅ Videos linked to channels");

        // Step 5: Create comments
        console.log(`Creating ${data.comments.length} comments...`);

        let createdComments = 0;
        for (const commentData of data.comments) {
            const videoId = youtubeVideoIdToMongoId.get(commentData.videoId);
            const userId = usernameToId.get(commentData.username);

            if (!videoId || !userId) {
                continue;
            }

            const commentCreatedAt = commentData.createdAt
                ? new Date(commentData.createdAt)
                : randomDate(oneYearAgo, now);

            await Comment.create({
                videoId,
                userId,
                content: commentData.content,
                createdAt: commentCreatedAt,
                updatedAt: commentCreatedAt,
            });

            createdComments++;
        }
        console.log(`✅ Created ${createdComments} comments`);

        // Summary
        console.log("\n" + "=".repeat(60));
        console.log("🎉 Database seeding completed successfully!");
        console.log("=".repeat(60));
        console.log(`📊 Summary:`);
        console.log(`   👥 Users: ${usernameToId.size}`);
        console.log(`   📺 Channels: ${data.channels.length}`);
        console.log(`   🎥 Videos: ${data.videos.length}`);
        console.log(`   💬 Comments: ${createdComments}`);
        console.log("=".repeat(60));
        console.log("\n🔑 Test User Credentials:");
        console.log("   Email: user@test.com");
        console.log("   Password: Testing123");
        console.log("=".repeat(60));

        process.exit(0);
    } catch (err) {
        console.error("Seeding Error: ", err);
        process.exit(1);
    }
}

seed();
