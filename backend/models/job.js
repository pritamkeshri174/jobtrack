const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        company: {
            type: String,
            required: true
        },

        position: {
            type: String,
            required: true
        },

        location: {
            type: String,
            default: "Remote"
        },

        jobType: {
            type: String,
            default: "Full Time"
        },

        status: {
            type: String,
            enum: ["Applied", "Interview", "Selected", "Rejected"],
            default: "Applied"
        },

        salary: {
            type: String,
            default: "Not specified"
        },

        notes: {
            type: String,
            default: ""
        },

        applicationDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);