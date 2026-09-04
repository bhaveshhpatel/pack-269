const Pack269Data = (function () {
  async function fetchStatic(collection) {
    const res = await fetch(window.PACK269_CONFIG.staticBasePath + collection + ".json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load " + collection + " (static, " + res.status + ")");
    return res.json();
  }
  async function fetchSupabase(collection) {
    const cfg = window.PACK269_CONFIG.supabase;
    if (!cfg.url || !cfg.anonKey) throw new Error("Supabase mode is on but url/anonKey are not configured in config.js");
    const res = await fetch(cfg.url + "/rest/v1/" + collection + "?select=*", {
      headers: { apikey: cfg.anonKey, Authorization: "Bearer " + cfg.anonKey }
    });
    if (!res.ok) throw new Error("Failed to load " + collection + " (supabase, " + res.status + ")");
    return res.json();
  }
  async function get(collection) {
    try {
      if (window.PACK269_CONFIG.mode === "supabase") return await fetchSupabase(collection);
      return await fetchStatic(collection);
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  return { get };
})();
