const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "Missing URL in request body" });

    const { nanoid } = await import('nanoid');
    const shortId = nanoid(8);
    const url = await URL.create({ shortId, redirectUrl: body.url, visitHistory: [] });
    return res.status(201).json({ shortId, redirectUrl: url.redirectUrl, visitHistory: url.visitHistory });
}

async function handleGetAnalytics(req,res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    if (!result) return res.status(404).json({ error: "Short URL not found" });
    return res.status(200).json({ totalClicks: result.visitHistory.length, visitHistory: result.visitHistory });
}

module.exports = { handleGenerateNewShortURL, handleGetAnalytics };