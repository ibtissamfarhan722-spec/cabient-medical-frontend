import { useState, useMemo } from "react";
import {
  Search, Filter, UserPlus, Pencil, Trash2,
  ArrowLeft, User, Phone, Mail, MapPin,
  Calendar, FileText, AlertTriangle, Droplets,
  Save, ChevronLeft, ChevronRight, CheckCircle2, X,
} from "lucide-react";

// ── Palette ──────────────────────────────────────────────────────────────────
const G      = "#2E8B7F";
const G_DARK = "#1f6259";
const G_LIGHT= "#e8f5f3";
const G_MID  = "#5AADA3";

// ── Initial data ─────────────────────────────────────────────────────────────
const INITIAL_PATIENTS = [
  { id:1,  prenom:"Sophie",  nom:"Martin",   dob:"15/03/1985", tel:"06 12 34 56 78", email:"sophie.martin@email.fr",   blood:"A+",  lastVisit:"28/02/2026", cin:"AB123456", address:"12 Rue de la Paix, 75001 Paris",  history:"Hypertension artérielle traitée depuis 2018. Antécédents familiaux de diabète type 2.", allergies:"Pénicilline, Aspirine" },
  { id:2,  prenom:"Marc",    nom:"Leblanc",  dob:"22/07/1978", tel:"07 23 45 67 89", email:"marc.leblanc@email.fr",    blood:"O-",  lastVisit:"25/02/2026", cin:"CD234567", address:"5 Avenue Victor Hugo, 69001 Lyon", history:"", allergies:"" },
  { id:3,  prenom:"Claire",  nom:"Moreau",   dob:"08/11/1992", tel:"06 34 56 78 90", email:"claire.moreau@email.fr",   blood:"B+",  lastVisit:"20/02/2026", cin:"EF345678", address:"", history:"", allergies:"" },
  { id:4,  prenom:"Pierre",  nom:"Garnier",  dob:"30/01/1965", tel:"07 45 67 89 01", email:"pierre.garnier@email.fr",  blood:"AB+", lastVisit:"18/02/2026", cin:"GH456789", address:"", history:"", allergies:"" },
  { id:5,  prenom:"Alice",   nom:"Fontaine", dob:"14/06/1990", tel:"06 56 78 90 12", email:"alice.fontaine@email.fr",  blood:"A-",  lastVisit:"15/02/2026", cin:"IJ567890", address:"", history:"", allergies:"" },
  { id:6,  prenom:"Thomas",  nom:"Rousseau", dob:"03/09/1980", tel:"07 67 89 01 23", email:"thomas.rousseau@email.fr", blood:"O+",  lastVisit:"12/02/2026", cin:"KL678901", address:"", history:"", allergies:"" },
  { id:7,  prenom:"Emma",    nom:"Dubois",   dob:"19/04/1997", tel:"06 78 90 12 34", email:"emma.dubois@email.fr",     blood:"B-",  lastVisit:"10/02/2026", cin:"MN789012", address:"", history:"", allergies:"" },
  { id:8,  prenom:"Lucas",   nom:"Bernard",  dob:"25/12/1988", tel:"07 89 01 23 45", email:"lucas.bernard@email.fr",   blood:"A+",  lastVisit:"08/02/2026", cin:"OP890123", address:"", history:"", allergies:"" },
  { id:9,  prenom:"Camille", nom:"Petit",    dob:"10/05/2000", tel:"06 90 12 34 56", email:"camille.petit@email.fr",   blood:"AB-", lastVisit:"05/02/2026", cin:"QR901234", address:"", history:"", allergies:"" },
  { id:10, prenom:"Julien",  nom:"Leroy",    dob:"07/08/1973", tel:"07 01 23 45 67", email:"julien.leroy@email.fr",    blood:"O+",  lastVisit:"01/02/2026", cin:"ST012345", address:"", history:"", allergies:"" },
];

const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const BLOOD_COLORS = { "A+":"#e05070","A-":"#e05070","B+":"#4f6ef7","B-":"#4f6ef7","AB+":"#9b59b6","AB-":"#9b59b6","O+":"#e08030","O-":"#e08030" };
const PER_PAGE = 8;

// ── Helpers ───────────────────────────────────────────────────────────────────
const initials = (p) => `${p.prenom[0]}${p.nom[0]}`.toUpperCase();
const emptyForm = () => ({ prenom:"", nom:"", cin:"", dob:"", tel:"", email:"", address:"", blood:"", history:"", allergies:"" });

// ── Blood badge ───────────────────────────────────────────────────────────────
const BloodBadge = ({ group, small }) => (
  <span style={{
    display:"inline-block",
    padding: small ? "2px 8px" : "3px 11px",
    borderRadius:20,
    fontSize: small ? 11 : 12,
    fontWeight:700,
    color: BLOOD_COLORS[group] || "#555",
    background: (BLOOD_COLORS[group] || "#aaa") + "18",
    border: `1px solid ${(BLOOD_COLORS[group] || "#aaa")}30`,
    letterSpacing:"0.3px",
  }}>{group}</span>
);

// ── Input field ───────────────────────────────────────────────────────────────
const Field = ({ label, required, icon: Icon, placeholder, value, onChange, type="text" }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    <label style={{ fontSize:13, fontWeight:600, color:"#374040" }}>
      {label} {required && <span style={{ color:"#e03150" }}>*</span>}
    </label>
    <div style={{ position:"relative" }}>
      {Icon && (
        <Icon size={14} color="#9ab0aa" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }} />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width:"100%", boxSizing:"border-box",
          padding: Icon ? "10px 14px 10px 34px" : "10px 14px",
          borderRadius:10, border:"1px solid #e0eae8",
          background:"#f8fbfa", fontSize:14, color:"#16302b",
          outline:"none", fontFamily:"inherit",
          transition:"border 0.15s",
        }}
        onFocus={e => e.target.style.borderColor = G}
        onBlur={e => e.target.style.borderColor = "#e0eae8"}
      />
    </div>
  </div>
);

// ── Textarea ──────────────────────────────────────────────────────────────────
const TextArea = ({ label, icon: Icon, placeholder, value, onChange }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    <label style={{ fontSize:13, fontWeight:600, color:"#374040", display:"flex", alignItems:"center", gap:5 }}>
      {Icon && <Icon size={13} color="#e08030" />} {label}
    </label>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={4}
      style={{
        width:"100%", boxSizing:"border-box",
        padding:"10px 14px", borderRadius:10,
        border:"1px solid #e0eae8", background:"#f8fbfa",
        fontSize:14, color:"#16302b", resize:"vertical",
        outline:"none", fontFamily:"inherit",
        transition:"border 0.15s",
      }}
      onFocus={e => e.target.style.borderColor = G}
      onBlur={e => e.target.style.borderColor = "#e0eae8"}
    />
  </div>
);

// ── Section card ──────────────────────────────────────────────────────────────
const Section = ({ icon: Icon, iconBg, title, children }) => (
  <div style={{
    background:"#fff", borderRadius:18, padding:"24px 28px",
    boxShadow:"0 1px 6px rgba(0,0,0,0.06)", marginBottom:16,
  }}>
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
      <div style={{ background: iconBg||G_LIGHT, borderRadius:10, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon size={16} color={G} />
      </div>
      <span style={{ fontSize:16, fontWeight:700, color:"#16302b" }}>{title}</span>
    </div>
    {children}
  </div>
);

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg }) => (
  <div style={{
    position:"fixed", bottom:28, right:28, zIndex:999,
    background:"#16302b", color:"#fff", borderRadius:14,
    padding:"12px 20px", fontSize:14, fontWeight:600,
    display:"flex", alignItems:"center", gap:8,
    boxShadow:"0 8px 30px rgba(0,0,0,0.18)",
    animation:"fadeIn 0.2s ease",
  }}>
    <CheckCircle2 size={16} color={G_MID} /> {msg}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// FORM VIEW  (add / edit)
// ══════════════════════════════════════════════════════════════════════════════
function PatientForm({ patient, onBack, onSave }) {
  const isEdit = !!patient;
  const [form, setForm] = useState(isEdit ? { ...patient } : emptyForm());
  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const previewName = `${form.prenom||""} ${form.nom||""}`.trim() || (isEdit ? "" : "Nouveau patient");
  const previewInit = form.prenom && form.nom ? `${form.prenom[0]}${form.nom[0]}`.toUpperCase() : "?";

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#f3f7f6", minHeight:"100vh", padding:"24px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:"#374040", display:"flex", alignItems:"center", padding:6, borderRadius:8 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:"#16302b" }}>
            {isEdit ? "Modifier le patient" : "Nouveau patient"}
          </div>
          <div style={{ fontSize:13, color:"#8aada8", marginTop:1 }}>
            {isEdit ? "Modifiez les informations du patient" : "Remplissez le formulaire médical"}
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:20, alignItems:"flex-start", flexWrap:"wrap" }}>
        {/* Left column */}
        <div style={{ flex:"1 1 560px" }}>
          <Section icon={User} title="Informations personnelles">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <Field label="Prénom" required placeholder="Sophie" value={form.prenom} onChange={set("prenom")} />
              <Field label="Nom" required placeholder="Martin" value={form.nom} onChange={set("nom")} />
              <Field label="CIN / N° SS" placeholder="AB123456" value={form.cin} onChange={set("cin")} />
              <Field label="Date de naissance" icon={Calendar} placeholder="jj/mm/aaaa" value={form.dob} onChange={set("dob")} />
            </div>
          </Section>

          <Section icon={Phone} iconBg="#eef0ff" title="Coordonnées">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <Field label="Téléphone" required icon={Phone} placeholder="06 12 34 56 78" value={form.tel} onChange={set("tel")} />
              <Field label="Email" icon={Mail} placeholder="patient@email.fr" value={form.email} onChange={set("email")} />
            </div>
            <div style={{ marginTop:16 }}>
              <Field label="Adresse" icon={MapPin} placeholder="12 Rue de la Paix, 75001 Paris" value={form.address} onChange={set("address")} />
            </div>
          </Section>

          <Section icon={FileText} iconBg="#f3f0ff" title="Antécédents médicaux">
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <TextArea label="Historique médical" placeholder="Décrivez l'historique médical du patient..." value={form.history} onChange={set("history")} />
              <TextArea label="Allergies" icon={AlertTriangle} placeholder="Listez les allergies connues..." value={form.allergies} onChange={set("allergies")} />
            </div>
          </Section>
        </div>

        {/* Right column */}
        <div style={{ width:300, flexShrink:0, display:"flex", flexDirection:"column", gap:16 }}>
          {/* Blood group */}
          <div style={{ background:"#fff", borderRadius:18, padding:"22px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <Droplets size={16} color="#e05070" />
              <span style={{ fontSize:15, fontWeight:700, color:"#16302b" }}>Groupe sanguin</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8 }}>
              {BLOOD_GROUPS.map(g => (
                <button key={g} onClick={() => set("blood")(form.blood===g ? "" : g)} style={{
                  padding:"8px 4px", borderRadius:10, border:"1px solid",
                  borderColor: form.blood===g ? G : "#dde8e6",
                  background: form.blood===g ? G : "#f8fbfa",
                  color: form.blood===g ? "#fff" : "#374040",
                  fontWeight:700, fontSize:13, cursor:"pointer",
                  transition:"all 0.15s",
                }}>{g}</button>
              ))}
            </div>
            {form.blood && (
              <div style={{
                marginTop:12, background:G_LIGHT, borderRadius:10,
                padding:"8px 12px", display:"flex", alignItems:"center", gap:6,
                fontSize:13, color:G, fontWeight:600,
              }}>
                <Droplets size={13} /> Groupe {form.blood} sélectionné
              </div>
            )}
          </div>

          {/* Preview card */}
          <div style={{ background:"#fff", borderRadius:18, padding:"28px 22px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", textAlign:"center" }}>
            <div style={{
              width:64, height:64, borderRadius:"50%",
              background: (form.prenom && form.nom) ? `linear-gradient(135deg,${G},${G_MID})` : "#ccc",
              color:"#fff", fontWeight:800, fontSize:22,
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 12px",
              boxShadow:`0 4px 14px ${G}40`,
            }}>{previewInit}</div>
            <div style={{ fontWeight:700, fontSize:16, color:"#16302b" }}>{previewName}</div>
            {form.blood && (
              <div style={{ marginTop:4 }}>
                <BloodBadge group={form.blood} small />
              </div>
            )}
          </div>

          {/* Actions */}
          <button onClick={() => onSave(form)} style={{
            background:`linear-gradient(135deg,${G},${G_DARK})`,
            border:"none", borderRadius:14, padding:"14px",
            color:"#fff", fontWeight:700, fontSize:15,
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            boxShadow:`0 4px 16px ${G}50`,
          }}>
            <Save size={16} /> {isEdit ? "Enregistrer les modifications" : "Créer le patient"}
          </button>
          <button onClick={onBack} style={{
            background:"none", border:"none", color:"#8aada8",
            fontSize:14, fontWeight:600, cursor:"pointer", padding:"8px",
          }}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LIST VIEW
// ══════════════════════════════════════════════════════════════════════════════
function PatientList({ patients, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const filtered = useMemo(() =>
    patients.filter(p =>
      `${p.prenom} ${p.nom} ${p.tel} ${p.email}`.toLowerCase().includes(search.toLowerCase())
    ), [patients, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const slice = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const cols = [
    { label:"PATIENT",          w:"26%" },
    { label:"TÉLÉPHONE",        w:"16%" },
    { label:"EMAIL",            w:"22%" },
    { label:"GROUPE SANGUIN",   w:"14%" },
    { label:"DERNIÈRE VISITE",  w:"14%" },
    { label:"ACTIONS",          w:"8%", right:true },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#f3f7f6", minHeight:"100vh", padding:"28px 28px 48px" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:24, fontWeight:800, color:"#16302b" }}>Gestion des Patients</div>
          <div style={{ fontSize:13, color:"#8aada8", marginTop:3 }}>{patients.length} patient(s) au total</div>
        </div>
        <button onClick={onAdd} style={{
          background:`linear-gradient(135deg,${G},${G_DARK})`,
          border:"none", borderRadius:14, padding:"12px 22px",
          color:"#fff", fontWeight:700, fontSize:14,
          cursor:"pointer", display:"flex", alignItems:"center", gap:8,
          boxShadow:`0 4px 16px ${G}50`,
        }}>
          <UserPlus size={16} /> Ajouter un patient
        </button>
      </div>

      {/* Search bar */}
      <div style={{
        background:"#fff", borderRadius:16, padding:"10px 16px",
        display:"flex", alignItems:"center", gap:10, marginBottom:20,
        boxShadow:"0 1px 6px rgba(0,0,0,0.06)",
      }}>
        <Search size={16} color="#9ab0aa" />
        <input
          placeholder="Rechercher par nom, téléphone ou email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{
            flex:1, border:"none", outline:"none", fontSize:14,
            color:"#16302b", background:"transparent", fontFamily:"inherit",
          }}
        />
        <button style={{
          display:"flex", alignItems:"center", gap:6,
          background:"none", border:"1px solid #dde8e6",
          borderRadius:10, padding:"6px 14px",
          fontSize:13, color:"#7a9e98", fontWeight:600, cursor:"pointer",
        }}>
          <Filter size={13} /> Filtrer
        </button>
      </div>

      {/* Table */}
      <div style={{ background:"#fff", borderRadius:18, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", overflow:"hidden" }}>
        {/* Head */}
        <div style={{
          display:"flex", padding:"13px 20px",
          borderBottom:"1px solid #edf2f1",
        }}>
          {cols.map(c => (
            <div key={c.label} style={{ width:c.w, fontSize:11, fontWeight:700, color:"#8aada8", letterSpacing:"0.6px", textAlign:c.right?"right":"left" }}>
              {c.label}
            </div>
          ))}
        </div>

        {/* Rows */}
        {slice.map((p, i) => (
          <PatientRow key={p.id} patient={p} odd={i%2===0} onEdit={() => onEdit(p)} onDelete={() => onDelete(p.id)} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:20, padding:"0 4px" }}>
          <div style={{ fontSize:13, color:"#8aada8" }}>
            Affichage {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} sur {filtered.length}
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <PageBtn onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}><ChevronLeft size={14}/></PageBtn>
            {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
              <PageBtn key={n} active={n===page} onClick={()=>setPage(n)}>{n}</PageBtn>
            ))}
            <PageBtn onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}><ChevronRight size={14}/></PageBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function PatientRow({ patient:p, odd, onEdit, onDelete }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:"flex", alignItems:"center",
        padding:"14px 20px",
        background: hov ? G_LIGHT : odd ? "#fafcfb" : "#fff",
        borderBottom:"1px solid #f0f4f2",
        transition:"background 0.15s",
      }}
    >
      {/* Patient */}
      <div style={{ width:"26%", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{
          width:38, height:38, borderRadius:"50%", flexShrink:0,
          background:`linear-gradient(135deg,${G},${G_MID})`,
          color:"#fff", fontWeight:800, fontSize:13,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 2px 8px ${G}35`,
        }}>{initials(p)}</div>
        <div>
          <div style={{ fontWeight:700, fontSize:14, color:"#16302b" }}>{p.prenom} {p.nom}</div>
          <div style={{ fontSize:12, color:"#9ab0aa", marginTop:1 }}>{p.dob}</div>
        </div>
      </div>
      {/* Tel */}
      <div style={{ width:"16%", fontSize:14, color:"#374040" }}>{p.tel}</div>
      {/* Email */}
      <div style={{ width:"22%", fontSize:14, color:"#374040" }}>{p.email}</div>
      {/* Blood */}
      <div style={{ width:"14%" }}>
        <BloodBadge group={p.blood} />
      </div>
      {/* Last visit */}
      <div style={{ width:"14%", fontSize:14, color:"#374040" }}>{p.lastVisit}</div>
      {/* Actions */}
      <div style={{ width:"8%", display:"flex", justifyContent:"flex-end", gap:8 }}>
        <ActionBtn onClick={onEdit} color="#4f6ef7" hoverBg="#eef0ff"><Pencil size={15}/></ActionBtn>
        <ActionBtn onClick={onDelete} color="#e03150" hoverBg="#fff0f2"><Trash2 size={15}/></ActionBtn>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, color, hoverBg, children }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        background: h ? hoverBg : "transparent",
        border:"none", borderRadius:8, width:32, height:32,
        display:"flex", alignItems:"center", justifyContent:"center",
        color, cursor:"pointer", transition:"all 0.15s",
      }}>{children}</button>
  );
}

function PageBtn({ onClick, disabled, active, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:34, height:34, borderRadius:10, border:"1px solid",
      borderColor: active ? G : "#dde8e6",
      background: active ? G : "#fff",
      color: active ? "#fff" : disabled ? "#ccc" : "#374040",
      fontWeight:700, fontSize:13, cursor: disabled ? "default" : "pointer",
      display:"flex", alignItems:"center", justifyContent:"center",
      transition:"all 0.15s",
    }}>{children}</button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function Patient() {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [view, setView]         = useState("list"); // "list" | "add" | "edit"
  const [editing, setEditing]   = useState(null);
  const [toast, setToast]       = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = (form) => {
    if (editing) {
      setPatients(ps => ps.map(p => p.id===editing.id ? { ...p, ...form } : p));
      showToast("Patient modifié avec succès");
    } else {
      const newP = { ...form, id: Date.now(), lastVisit: new Date().toLocaleDateString("fr-FR") };
      setPatients(ps => [newP, ...ps]);
      showToast("Patient créé avec succès");
    }
    setView("list"); setEditing(null);
  };

  const handleDelete = (id) => {
    setPatients(ps => ps.filter(p => p.id !== id));
    showToast("Patient supprimé");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin:0; padding:0; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {view === "list" && (
        <PatientList
          patients={patients}
          onAdd={() => { setEditing(null); setView("add"); }}
          onEdit={(p) => { setEditing(p); setView("edit"); }}
          onDelete={handleDelete}
        />
      )}
      {(view === "add" || view === "edit") && (
        <PatientForm
          patient={editing}
          onBack={() => { setView("list"); setEditing(null); }}
          onSave={handleSave}
        />
      )}
      {toast && <Toast msg={toast} />}
    </>
  );
}