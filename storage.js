// Speicher-Schicht. Aktuell: localStorage im Browser (nur auf diesem Gerät!).
// Für gemeinsame Nutzung (Inhaber + Mitarbeiter) diese zwei Funktionen später
// durch ein Backend ersetzen (z. B. Supabase oder Firebase), der Rest der App bleibt gleich.
const Store = {
  KEY: "frites-betrieb-v1",
  empty() { return { shifts: [], times: [], orders: [], mhd: [] }; },
  load() {
    try { return Object.assign(this.empty(), JSON.parse(localStorage.getItem(this.KEY) || "{}")); }
    catch (e) { return this.empty(); }
  },
  save(data) { localStorage.setItem(this.KEY, JSON.stringify(data)); }
};
