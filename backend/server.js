const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const Job = require("./models/job");

const app = express();


// ==========================================
// CONNECT DATABASE
// ==========================================

connectDB();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors({
    origin: [
        "https://jobtrack-88e67.web.app",
        "https://jobtrack-88e67.firebaseapp.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.json({
        message: "JobTrack Backend is running 🚀"
    });
});


// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);
app.get("/test-public", (req, res) => {
    res.json({
        message: "TEST ROUTE WORKING"
    });
});
// PUBLIC JOB STATISTICS
app.get("/api/jobs/public-stats", async (req, res) => {
    try {
        const total = await Job.countDocuments();

        const applied = await Job.countDocuments({
            status: "Applied"
        });

        const interview = await Job.countDocuments({
            status: "Interview"
        });

        const selected = await Job.countDocuments({
            status: "Selected"
        });

        res.json({
            total,
            applied,
            interview,
            selected
        });

    } catch (error) {
        console.error("Public Stats Error:", error);

        res.status(500).json({
            message: "Failed to get public statistics"
        });
    }
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;