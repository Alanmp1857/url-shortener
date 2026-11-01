const express = require("express");
const { connectDB } = require("./connect.js");
const path = require("path");
const URL = require("./models/url");
const cookieParser = require("cookie-parser");
const { restrictToLoggedInUserOnly, checkAuth } = require("./middlewares/auth");

// Routes
const staticRoute = require("./routes/staticRouter");
const urlRoutes = require("./routes/url");
const userRoutes = require("./routes/user");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
const PORT = 8000;

connectDB("mongodb://localhost:27017/short-url").then(() => {
  console.log("Connected to MongoDB");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.get("/test",async (req,res) => {
//   const allUrls = await URL.find();
//   return res.render("home", { urls: allUrls });
// })

app.use("/", checkAuth, staticRoute);
app.use("/url", restrictToLoggedInUserOnly, urlRoutes);
app.use("/user", userRoutes);

app.get("/:shortId", async(req,res) => {
    const shortId = req.params.shortId;
    const url = await URL.findOneAndUpdate({ shortId }, { $push: { visitHistory: { timestamp: new Date() } } });
    if (!url) return res.status(404).json({ error: "Short URL not found" });
    return res.redirect(url.redirectUrl);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
