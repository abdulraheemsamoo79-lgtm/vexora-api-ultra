const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: "Too many requests, please try again later." },
    keyGenerator: (req) => {
        return req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
    },
    standardHeaders: true,
    legacyHeaders: false
});

app.use(cors());

const routes = [
    "ytdl", "ytmp3", "ytmp4", "capcut", "gdrive", "mediafire", "lyrics", "attp", "pinterest-video", "ttmp3", "twitterdl", "igdl", "fbdl", "ttdl", "gitclone", "spotifydl", "aptoide",
    "githubstalk", "searchgroups", "ttsearch", "ytsearch", "npmsearch", "duckduckgo",
    "pinterest",
    "ssweb", "translate", "weather", "qrcodegenerator",
    "cekkhodam", "tahukahkamu", "detiknews"
];

routes.forEach(route => {
    app.use(`/api/${route}`, limiter, require(`./api/${route}`));
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/docs", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "documentation.html"));
});

app.use("/api/*", (req, res) => {
    res.status(404).json({ 
        error: true,
        message: "API endpoint not found",
        documentation: "/docs"
    });
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

module.exports = app;

// Local/self-host run (Vercel par ye block asar nahi karta)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log("Server running on port " + PORT));
}
