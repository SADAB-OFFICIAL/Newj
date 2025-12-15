export default async function handler(req, res) {
  try {
    const target = req.query.url;
    if (!target) {
      return res.status(400).json({ error: "No URL provided" });
    }

    const r = await fetch(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/133 Mobile",
        "Referer": "https://netvlyx.pages.dev",
      },
    });

    const text = await r.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");

    res.status(200).send(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
