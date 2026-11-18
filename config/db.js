const dns = require("dns");
const mongoose = require("mongoose");
const InterviewRole = require("../models/InterviewRole");
const { DEFAULT_ROLES } = require("../utils/defaultRoles");

mongoose.set("bufferCommands", false);

const isDbConnected = () => mongoose.connection.readyState === 1;

let connectPromise = null;
let rolesSeeded = false;

const ensureRolesSeeded = async () => {
  if (rolesSeeded) return;
  try {
    const count = await InterviewRole.countDocuments();
    if (count === 0) {
      for (const role of DEFAULT_ROLES) {
        await InterviewRole.findOneAndUpdate(
          { title: role.title },
          role,
          { upsert: true, new: true }
        );
      }
      console.log(`Seeded ${DEFAULT_ROLES.length} default interview roles in MongoDB`);
    }
    rolesSeeded = true;
  } catch (err) {
    console.warn("Could not auto-seed interview roles:", err.message);
  }
};

const connectWithRetry = async (uri) => {
  const options = {
    serverSelectionTimeoutMS: 5000,
    family: 4,
  };

  try {
    await mongoose.connect(uri, options);
  } catch (err) {
    // Windows / ISP DNS servers often refuse Node.js SRV lookups for mongodb+srv://
    if (uri.startsWith("mongodb+srv://") && /querySrv/i.test(err.message)) {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
      await mongoose.connect(uri, options);
    } else {
      throw err;
    }
  }
};

const connectDB = async () => {
  if (isDbConnected()) {
    await ensureRolesSeeded();
    return true;
  }

  const uri = (process.env.MONGO_URI || process.env.MONGODB_URI || "").trim();
  if (!uri) {
    console.warn("MONGO_URI not set — running with in-memory fallback store");
    return false;
  }

  if (!connectPromise) {
    connectPromise = connectWithRetry(uri)
      .then(async () => {
        console.log("MongoDB Connected:", mongoose.connection.name);
        await ensureRolesSeeded();
        return true;
      })
      .catch((error) => {
        connectPromise = null;
        console.warn("MongoDB connection failed — using in-memory fallback store:", error.message);
        return false;
      });
  }

  return connectPromise;
};

module.exports = connectDB;
module.exports.isDbConnected = isDbConnected;
module.exports.ensureRolesSeeded = ensureRolesSeeded;