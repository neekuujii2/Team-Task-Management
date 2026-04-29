import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";

dotenv.config();

const seedUsers = [
  {
    name: "Team 1 Admin",
    email: "admin@team1.com",
    password: "123456",
    role: "admin",
    teamId: "TEAM_ABC_001",
  },
  {
    name: "Team 1 Member",
    email: "member@team1.com",
    password: "123456",
    role: "member",
    teamId: "TEAM_ABC_001",
  },
];

const runSeed = async () => {
  try {
    await connectDB();

    for (const user of seedUsers) {
      const existing = await User.findOne({ email: user.email });
      if (!existing) {
        await User.create(user);
      }
    }

    console.log("Seed users ensured successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed", error);
    process.exit(1);
  }
};

runSeed();
