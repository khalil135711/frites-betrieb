const T = {
  shifts: { name: "Schichtplan", sort: "datum", f: [["mitarbeiter","Mitarbeiter","text"],["datum","Datum","date"],["von","Von","time"],["bis","Bis","time"]] },
  times:  { name: "Arbeitszeiten", sort: "datum", f: [["mitarbeiter","Mitarbeiter","text"],["datum","Datum","date"],["von","Beginn","time"],["bis","Ende","time"],["pause","Pause (Min)","number"]] },
  orders: { name: "Bestellungen", sort: "lieferdatum", f: [["artikel","Artikel","text"],["menge","Menge","text"],["lieferant","Lieferant","text"],["lieferdatum","Lieferung","date"],["status","Status",["offen","bestellt","geliefert"]]] },
  mhd:    { name: "MHD", sort: "mhd", f: [["artikel","Artikel","text"],["charge","Charge","text"],["menge","Menge","text"],["mhd","MHD","date"]] }
};
let cur = "shifts", data = Store.load();
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt = d => d ? d.split("-").reverse().join(".") : "";

function hours(r) {
  if (!r.von || !r.bis) return "";
  const [a, b] = [r.von, r.bis].map(t => { const [h, m] = t.split(":"); return +h * 60 + +m; });
  let d = b - a; if (d < 0) d += 1440; d -= +r.pause || 0;
  return (d / 60).toFixed(2).replace(".", ",") + " h";
}
function mhdPill(d) {
  if (!d) return "";
  const days = Math.ceil((new Date(d) - new Date(new Date().toDateString())) / 864e5);
  const [c, t] = days < 0 ? ["var(--bad)", "abgelaufen"] : days <= 3 ? ["var(--bad)", days + " Tage"] : days <= 7 ? ["var(--warn)", days + " Tage"] : ["var(--ok)", days + " Tage"];
  return `<span class="pill" style="background:${c}">${t}</span>`;
}
function renderNav() {
  $("nav").innerHTML = Object.entries(T).map(([k, v]) => `<button class="${k === cur ? "on" : ""}" data-k="${k}">${v.name}</button>`).join("");
}
function renderForm() {
  $("form").innerHTML = T[cur].f.map(([k, l, ty]) => `<label>${l}` + (Array.isArray(ty)
    ? `<select name="${k}">${ty.map(o => `<option>${o}</option>`).join("")}</select>`
    : `<input name="${k}" type="${ty}" ${ty === "number" ? 'min="0" value="0"' : "required"}>`) + `</label>`).join("") + `<button>Hinzufügen</button>`;
}
function renderTable() {
  const t = T[cur];
  const list = data[cur].slice().sort((a, b) => String(a[t.sort]).localeCompare(String(b[t.sort])));
  const extra = cur === "times" ? "<th>Stunden</th>" : cur === "mhd" ? "<th>Status</th>" : "";
  const head = "<tr>" + t.f.map(f => `<th>${f[1]}</th>`).join("") + extra + "<th></th></tr>";
  const body = list.map(r => "<tr>" + t.f.map(([k,, ty]) => `<td>${ty === "date" ? fmt(r[k]) : esc(r[k])}</td>`).join("")
    + (cur === "times" ? `<td>${hours(r)}</td>` : cur === "mhd" ? `<td>${mhdPill(r.mhd)}</td>` : "")
    + `<td><button class="x" data-id="${r.id}" title="Löschen">✕</button></td></tr>`).join("");
  $("tbl").innerHTML = head + (body || `<tr><td class="note" colspan="9">Noch keine Einträge.</td></tr>`);
}
function warn(msg) { $("warn").style.display = "block"; $("warn").textContent = msg; }
function persist() { try { Store.save(data); } catch (e) { warn("Speichern im Browser nicht möglich."); } }

$("nav").onclick = e => { const k = e.target.dataset.k; if (k) { cur = k; renderNav(); renderForm(); renderTable(); } };
$("form").onsubmit = e => {
  e.preventDefault();
  const o = Object.fromEntries(new FormData($("form")));
  o.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  data[cur].push(o); persist(); renderTable(); $("form").reset();
};
$("tbl").onclick = e => {
  const id = e.target.dataset.id;
  if (!id || !confirm("Eintrag löschen?")) return;
  data[cur] = data[cur].filter(r => r.id !== id); persist(); renderTable();
};
$("exp").onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  a.download = "frites-betrieb-" + new Date().toISOString().slice(0, 10) + ".json"; a.click();
};
$("imp").onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  try {
    const j = JSON.parse(await f.text());
    if (!confirm("Aktuelle Daten durch die Datei ersetzen?")) return;
    data = Object.assign(Store.empty(), j); persist(); renderTable();
  } catch (err) { warn("Datei konnte nicht gelesen werden."); }
  e.target.value = "";
};
warn("Testversion: Daten werden nur in diesem Browser gespeichert, nicht geteilt.");
renderNav(); renderForm(); renderTable();
