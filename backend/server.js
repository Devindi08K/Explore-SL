const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Welcome Route
app.get("/", (req, res) => {
    res.send("Welcome to the Tourism Website");
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.error("Error connecting to MongoDB:", error));

// Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const destinationRoutes = require("./routes/destinationRoutes");
const blogRoutes = require("./routes/blogRoutes");
const tourRoutes = require("./routes/tourRoutes");
const affiliateLinksRoute = require("./routes/affiliateLinksRoute");

app.use("/api/auth", authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/affiliate-links", affiliateLinksRoute);
