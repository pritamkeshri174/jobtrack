const express = require("express");
const Job = require("../models/job");
const authMiddleware = require("../authMiddleware");

const router = express.Router();

console.log("JOB ROUTES LOADED ✅");
// PUBLIC JOB STATISTICS
router.get("/public-stats", async (req, res) => {
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
// ADD JOB
// ==========================================

router.post("/", authMiddleware, async (req, res) => {
    try {
const {
    company,
    position,
    location,
    jobType,
    status,
    salary,
    notes,
    applicationDate
} = req.body;

       const job = await Job.create({
    user: req.user.userId,
    company,
    position,
    location,
    jobType,
    status,
    salary,
    notes,
    applicationDate
});
        res.status(201).json({
            message: "Application added successfully ✅",
            job
        });

    } catch (error) {
        console.error("Add Job Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});
// ==========================================
// DELETE JOB
// ==========================================   

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
           const deletedJob = await Job.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId
});

        if (!deletedJob) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: "Application deleted successfully ✅"
        });

    } catch (error) {
        console.error("Delete Job Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});
// ==========================================
// UPDATE JOB
// ==========================================

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const {
            company,
            position,
            location,
            jobType,
            status,
            salary,
            notes,
            applicationDate
        } = req.body;

       const updatedJob = await Job.findOneAndUpdate(
    {
        _id: req.params.id,
        user: req.user.userId
    },
    {
        company,
        position,
        location,
        jobType,
        status,
        salary,
        notes,
        applicationDate
    },
    {
        new: true,
        runValidators: true
    }
);
        if (!updatedJob) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: "Application updated successfully ✅",
            job: updatedJob
        });

    } catch (error) {
        console.error("Update Job Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

 // GET JOB STATISTICS
router.get("/stats", authMiddleware, async (req, res) => {
    try {
        const total = await Job.countDocuments({
            user: req.user.userId
        });

        const applied = await Job.countDocuments({
            user: req.user.userId,
            status: "Applied"
        });

        const interview = await Job.countDocuments({
            user: req.user.userId,
            status: "Interview"
        });

        const selected = await Job.countDocuments({
            user: req.user.userId,
            status: "Selected"
        });

        res.json({
            total,
            applied,
            interview,
            selected
        });

    } catch (error) {
        console.error("Stats Error:", error);

        res.status(500).json({
            message: "Failed to get statistics"
        });
    }
});
// ==========================================
// GET ALL JOBS
// ==========================================

router.get("/", authMiddleware, async (req, res) => {
    try {
        const jobs = await Job.find({
    user: req.user.userId
}).sort({
    applicationDate: -1
});

        res.json(jobs);

    } catch (error) {
        console.error("Get Jobs Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});



module.exports = router;