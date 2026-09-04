// Pack 269 data configuration.
// Today this site is fully static, no backend, no server, nothing to break.
// When you're ready to add an admin/CMS, flip mode to "supabase", fill in the
// supabase block below, and nothing else in the site needs to change: every page
// already reads content through Pack269Data.get(), defined in data.js.
window.PACK269_CONFIG = {
  mode: "static",
  staticBasePath: "assets/data/",
  supabase: {
    url: "",
    anonKey: ""
  }
};
