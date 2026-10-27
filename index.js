const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const keyauth = require("./lib/keyauth");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 600,
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

// Open health check (baghair key ke)
app.get("/api/ping", (req, res) => {
    res.json({ status: true, creator: "VEXORA API", message: "pong", endpoints: routes.length });
});

// API key system — register + admin
app.post("/auth/register", keyauth.register);
app.post("/admin-api/login", keyauth.adminLogin);
app.get("/admin-api/keys", keyauth.requireAdmin, keyauth.adminListKeys);
app.post("/admin-api/keys", keyauth.requireAdmin, keyauth.adminCreateKey);
app.post("/admin-api/keys/:key/update", keyauth.requireAdmin, keyauth.adminUpdateKey);
app.delete("/admin-api/keys/:key", keyauth.requireAdmin, keyauth.adminDeleteKey);
app.get("/admin-api/stats", keyauth.requireAdmin, keyauth.adminStats);

// Baqi tamam /api/* ke liye key lazmi
app.use("/api", keyauth.keyAuth);

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

app.get("/getkey", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "getkey.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
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
