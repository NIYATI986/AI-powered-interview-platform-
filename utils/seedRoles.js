require("dotenv").config();
const connectDB = require("../config/db");
const InterviewRole = require("../models/InterviewRole");
const { DEFAULT_ROLES } = require("./defaultRoles");

const seedRoles = async () => {
  try {
    const connected = await connectDB();
    if (!connected) {
      console.error("Seeding failed: could not connect to MongoDB. Check MONGO_URI in .env.");
      process.exit(1);
    }

    for (const role of DEFAULT_ROLES) {
      await InterviewRole.findOneAndUpdate(
        { title: role.title },
        role,
        { upsert: true, new: true }
      );
    }

    console.log(`${DEFAULT_ROLES.length} roles seeded successfully`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedRoles();