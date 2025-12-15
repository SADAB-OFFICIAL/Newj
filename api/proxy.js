export default async function handler(req, res) {
  try {
    const target = req.query.url;
    if (!target) {
      return res.status(400).json({ error: "No URL provided" });
    }

    const response = await fetch(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/133 Mobile",
        "Referer": "https://netvlyx.pages.dev",
      },
    });

    const data = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", response.headers.get("content-type"));

    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
