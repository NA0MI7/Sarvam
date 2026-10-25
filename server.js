// BillSamjho local server. Run: node server.js   (Node 18+, no npm install needed)
const http = require("http"), fs = require("fs"), path = require("path");
try {
  fs.readFileSync(path.join(__dirname, ".env"), "utf8").split(/\r?\n/).forEach(l => {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  });
} catch (e) {}
const { API_KEY, API_URL = "https://api.anthropic.com/v1/messages", MODEL = "claude-sonnet-5-5", PORT = 3000, HOST = "127.0.0.1" } = process.env;
if (!API_KEY) console.warn("Missing API_KEY. Add it to .env");

const send = (res, code, obj) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(obj)); };

http.createServer((req, res) => {
  if (req.method === "GET" && (req.url === "/" || req.url.startsWith("/?"))) {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    return res.end(fs.readFileSync(path.join(__dirname, "index.html")));
  }
  if (req.method === "POST" && req.url === "/api/chat") {
    let size = 0; const chunks = [];
    req.on("data", c => { size += c.length; if (size > 25e6) req.destroy(); else chunks.push(c); });
    req.on("end", async () => {
      try {
        const { system, messages } = JSON.parse(Buffer.concat(chunks).toString());
        const r = await fetch(API_URL, {
          method: "POST",
          headers: { "content-type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01" },
          body: JSON.stringify({ model: MODEL, max_tokens: 3000, system, messages })
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) return send(res, 502, { error: (j.error && j.error.message) || ("API error " + r.status) });
        send(res, 200, { text: (j.content || []).filter(b => b.type === "text").map(b => b.text).join("\n") });
      } catch (e) { send(res, 500, { error: "Server could not reach the AI: " + e.message }); }
    });
    return;
  }
  send(res, 404, { error: "Not found" });
}).listen(PORT, HOST, () => console.log(`BillSamjho running at http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`));
