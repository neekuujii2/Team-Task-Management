import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { Team } from "../models/Team.js";
import { User } from "../models/User.js";

dotenv.config();

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const seedData = async () => {
  try {
    await connectDB();

    await Promise.all([
      Task.deleteMany({}),
      Project.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
    ]);

    const users = await User.create([
      {
        name: "Alice Admin",
        email: "alice.admin@alpha.com",
        password: "123456",
        role: "admin",
        teamId: "TEMP_ALPHA",
      },
      {
        name: "Mia Member",
        email: "mia.member@alpha.com",
        password: "123456",
        role: "member",
        teamId: "TEMP_ALPHA",
      },
      {
        name: "Ben Member",
        email: "ben.member@beta.com",
        password: "123456",
        role: "member",
        teamId: "TEMP_BETA",
      },
      {
        name: "Nina Member",
        email: "nina.member@beta.com",
        password: "123456",
        role: "member",
        teamId: "TEMP_BETA",
      },
    ]);

    const [alphaAdmin, alphaMember, betaMemberOne, betaMemberTwo] = users;

    const alphaTeam = await Team.create({
      name: "Alpha Team",
      members: [alphaAdmin._id, alphaMember._id],
      createdBy: alphaAdmin._id,
    });

    const betaTeam = await Team.create({
      name: "Beta Team",
      members: [betaMemberOne._id, betaMemberTwo._id],
      createdBy: alphaAdmin._id,
    });

    await Promise.all([
      User.findByIdAndUpdate(alphaAdmin._id, { teamId: alphaTeam._id.toString() }),
      User.findByIdAndUpdate(alphaMember._id, { teamId: alphaTeam._id.toString() }),
      User.findByIdAndUpdate(betaMemberOne._id, { teamId: betaTeam._id.toString() }),
      User.findByIdAndUpdate(betaMemberTwo._id, { teamId: betaTeam._id.toString() }),
    ]);

    const projects = await Project.create([
      {
        name: "Alpha Launch",
        description: "Product launch planning for Alpha Team.",
        createdBy: alphaAdmin._id,
        teamId: alphaTeam._id,
      },
      {
        name: "Alpha Dashboard",
        description: "Internal reporting improvements for Alpha Team.",
        createdBy: alphaAdmin._id,
        teamId: alphaTeam._id,
      },
      {
        name: "Beta Mobile App",
        description: "Mobile delivery roadmap for Beta Team.",
        createdBy: alphaAdmin._id,
        teamId: betaTeam._id,
      },
    ]);

    const [alphaLaunchProject, alphaDashboardProject, betaMobileProject] = projects;

    await Task.create([
      {
        title: "Finalize launch checklist",
        description: "Complete the release checklist and sign-off.",
        status: "done",
        assignedTo: alphaMember._id,
        projectId: alphaLaunchProject._id,
        teamId: alphaTeam._id,
        dueDate: daysFromNow(-1),
      },
      {
        title: "Prepare stakeholder presentation",
        description: "Create the slide deck for launch stakeholders.",
        status: "in-progress",
        assignedTo: alphaAdmin._id,
        projectId: alphaLaunchProject._id,
        teamId: alphaTeam._id,
        dueDate: daysFromNow(2),
      },
      {
        title: "Refine dashboard widgets",
        description: "Improve the KPI widgets for the reporting dashboard.",
        status: "in-progress",
        assignedTo: alphaMember._id,
        projectId: alphaDashboardProject._id,
        teamId: alphaTeam._id,
        dueDate: daysFromNow(4),
      },
      {
        title: "Design onboarding flow",
        description: "Draft the first-run experience for the mobile app.",
        status: "todo",
        assignedTo: betaMemberOne._id,
        projectId: betaMobileProject._id,
        teamId: betaTeam._id,
        dueDate: daysFromNow(5),
      },
      {
        title: "Set up QA regression suite",
        description: "Define the core regression checks for the beta release.",
        status: "todo",
        assignedTo: betaMemberTwo._id,
        projectId: betaMobileProject._id,
        teamId: betaTeam._id,
        dueDate: daysFromNow(7),
      },
      {
        title: "Resolve delayed API integration",
        description: "Fix overdue dependency blocking the mobile release.",
        status: "todo",
        assignedTo: betaMemberOne._id,
        projectId: betaMobileProject._id,
        teamId: betaTeam._id,
        dueDate: daysFromNow(-3),
      },
    ]);

    console.log("Seed data created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed", error);
    process.exit(1);
  }
};

seedData();
