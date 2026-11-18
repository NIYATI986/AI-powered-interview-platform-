const app = require("../server");

module.exports = (req, res) => {
  const urlObj = new URL(req.url || "/", "http://localhost");
  const rewrittenPath = urlObj.searchParams.get("__path");
  if (rewrittenPath !== null) {
    urlObj.searchParams.delete("__path");
    const qs = urlObj.searchParams.toString();
    const cleanPath = rewrittenPath.replace(/^\/+/, "");
    req.url = `/api/${cleanPath}${qs ? `?${qs}` : ""}`;
  }
  return app(req, res);
};