const express = require("express");
const urlRoutes = require("./routes/url");
const { connectDB } = require("./connect.js");
const URL = require("./models/url");

const app = express();
const PORT = 8000;

connectDB("mongodb://localhost:27017/short-url").then(() => {
  console.log("Connected to MongoDB");
});

app.use(express.json());

app.get("/:shortId", async(req,res) => {
    const shortId = req.params.shortId;
    const url = await URL.findOneAndUpdate({ shortId }, { $push: { visitHistory: { timestamp: new Date() } } });
    if (!url) return res.status(404).json({ error: "Short URL not found" });
    return res.redirect(url.redirectUrl);
})

app.use("/url", urlRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

