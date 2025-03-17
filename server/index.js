const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require('./models/user.model');
const Job = require("./models/job.model");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")

const connectToMongoDB = require('./db/connectToMongoDB');
const { authenticateToken } = require('./utilities');


const app = express();
dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin: "*",
    }),
);


app.get("/", (req, res) => {
    res.json({ data: 'Hello' });
});

// create Account
app.post("/create-account", async (req, res) => {
    try {

        const { fullName, email, password } = req.body;

        if (!fullName) {
            return res.status(400).json({ error: true, message: "Full Name is required" });
        }

        if (!email) {
            return res.status(400).json({ error: true, message: "Email is required" });
        }

        if (!password) {
            return res.status(400).json({ error: true, message: "Password is required" });
        }

        const isUser = await User.findOne({ email: email });
        if (isUser) {
            return res.json({ error: true, message: "User already exist" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        await user.save();

        const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15d"
        });

        return res.json({
            error: false,
            user,
            accessToken,
            message: "Resgistered Successfully"
        });
    } catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// login
app.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ error: true, message: "Email is required" });
        }

        if (!password) {
            return res.status(400).json({ error: true, message: "Password is required" });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        const isComparePassword = await bcrypt.compare(password, user.password);

        if (!isComparePassword) {
            return res.status(400).json({ error: true, message: "Invalid Password" });
        }

        const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15d"
        });
        return res.json({
            error: false,
            user,
            accessToken,
            message: "Logged In Successfully"
        });

    } catch (error) {
        console.log("Error in login", error.message);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// logout
app.post("/logout", async (req, res) => {
    try {
        res.cookie("job-tracker", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in Logging out", error.message)
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// get User
app.get("/get-user", authenticateToken, async (req, res) => {
    try {
        const { user } = req.user;

        const isUser = await User.findOne({ _id: user._id });
        if (!isUser) {
            return res.sendStatus(401);
        }

        return res.json({
            user: { fullName: isUser.fullName, email: isUser.email, "_id": isUser._id },
            message: "",
        });

    } catch (error) {
        console.log("Error in getting user", error.message);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

//add Job Applied
app.post("/add-job", authenticateToken, async (req, res) => {

    try {
        const { company, position, status, notes } = req.body;
        const userId = req.user.user._id;

        if (!company) {
            return res.status(400).json({ error: true, message: "Company name is required" });
        }
        if (!position) {
            return res.status(400).json({ error: true, message: "Applied position is required" });
        }
        if (!status) {
            return res.status(400).json({ error: true, message: "Status is required" });
        }

        if (status === 'Interview Scheduled' && !notes) {
            return res.status(400).json({ error: true, message: "Interview details is required" });
        }

        const job = new Job({
            userId: userId,
            company: company,
            position: position,
            status: status,
            notes: notes
        });
        console.log(job);

        await job.save();
        return res.json({
            error: false,
            job,
            message: "Applied Job added successfully"
        });

    } catch (error) {
        console.log("Error in adding Job", error.message);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }


});

// Edit Job details
app.put("/edit-job/:jobId", authenticateToken, async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const { company, position, status, notes } = req.body;
        const user = req.user.user;

        const job = await Job.findOne({ _id: jobId, userId: user._id });

        if (!job) {
            return res.status(404).json({ error: true, message: "The given job is not found." });
        }

        if (company) {
            job.company = company;
        }

        if (position) {
            job.position = position;
        }
        if (status) {
            job.status = status;
        }

        if (notes)
            job.notes = notes;

        await job.save();
        return res.json({
            error: false,
            job,
            message: "Job updated successfully"
        });

    } catch (error) {
        console.log("Error in updating Job", error.message);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }

});

// get all jobs
app.get("/get-all-jobs", authenticateToken, async (req, res) => {
    try {
        const user = req.user.user;
        const jobs = await Job.find({ userId: user._id });
        return res.json({
            error: false,
            jobs,
            message: "All the jobs retrieved successfully"
        });

    } catch (error) {
        console.log("Error in getting Jobs", error.message);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }

});

// delete job
app.delete("/delete-job/:jobId", authenticateToken, async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const user = req.user.user;
        const job = await Job.findOne({ _id: jobId, userId: user._id });
        if (!job) {
            return res.status(404).json({ error: true, message: "Job not found" });
        }

        await Job.deleteOne({ _id: jobId, userId: user._id });

        return res.json({
            error: false,
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.log("Error in deleting Job", error.message);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});


app.listen(8000, () => {
    connectToMongoDB;
    console.log(`Server running at port http://localhost:8000`);
});

module.exports = app;