const puppeteer = require("puppeteer");

async function extractFinalDownload(link) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process"
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  );

  let finalVideo = null;

  // 🔥 CAPTURE EVERYTHING
  page.on("response", async (res) => {
    try {
      const url = res.url();
      const type = res.headers()["content-type"] || "";

      if (
        type.includes("video") ||
        url.includes("googlevideo") ||
        url.endsWith(".mp4") ||
        url.endsWith(".mkv")
      ) {
        finalVideo = url;
      }
    } catch {}
  });

  // Page open
  await page.goto(link, { waitUntil: "domcontentloaded", timeout: 60000 });

  // ⏳ Wait a bit
  await page.waitForTimeout(5000);

  // 🔘 Click ALL clickable things (aggressive)
  await page.evaluate(() => {
    const els = [...document.querySelectorAll("a,button")];
    els.forEach(el => {
      try {
        el.click();
      } catch {}
    });
  });

  // ⏳ Wait for redirects / streams
  await page.waitForTimeout(20000);

  // 🧠 Check if iframe exists
  const frames = page.frames();
  for (const frame of frames) {
    try {
      const src = frame.url();
      if (
        src.includes("googlevideo") ||
        src.endsWith(".mp4") ||
        src.endsWith(".mkv")
      ) {
        finalVideo = src;
      }
    } catch {}
  }

  await browser.close();
  return finalVideo;
}

module.exports = extractFinalDownload;
