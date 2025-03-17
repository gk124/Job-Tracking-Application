const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    company: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    appliedOn: {
        type: Date,
        default: new Date().getTime()
    }
})

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;