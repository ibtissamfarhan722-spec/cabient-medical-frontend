import { useState, useEffect } from "react";
import {
  Building2, Mail, MapPin, Save, Award,
  Users, CheckCircle, Pencil, Trash2, UserPlus,
  Phone, Star, Camera, Lock, Eye, EyeOff,
  ShieldCheck, KeyRound,
} from "lucide-react";

const G       = "#2E8B7F";
const G_DARK  = "#1f6259";
const G_LIGHT = "#e8f5f3";
const G_MID   = "#5AADA3";

const SPECIALITES = ["Cardiologie","Dermatologie","Pédiatrie","Médecine générale","Orthopédie","Ophtalmologie","Neurologie","Gynécologie","Pneumologie","Rhumatologie"];

const DEFAULT_PROFILE = {
  nom: "Dr. Jean Martin", specialite: "Médecin généraliste", note: 5,
  cabinetNom: "Cabinet Médical Dr. Martin", email: "contact@cabinet-martin.fr",
  adresse: "15 Avenue des Champs-Élysées", localisation: "Paris 8ème", ville: "Paris",
  specialites: ["Cardiologie", "Médecine générale"],
};

const DEFAULT_SECRETAIRES = [
  { id:1, nom:"Marie Dubois",   email:"marie.dubois@cabinet.fr",  tel:"+33 6 12 34 56 78", statut:"Actif"   },
  { id:2, nom:"Julie Martin",   email:"julie.martin@cabinet.fr",  tel:"+33 6 98 76 54 32", statut:"Actif"   },
  { id:3, nom:"Sophie Bernard", email:"sophie.bernard@cabinet.fr",tel:"+33 6 45 67 89 01", statut:"Inactif" },
];

// ── localStorage helpers ──────────────────────────────────────
const load  = (key, def) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } };
const store = (key, val)  => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

/**
 * Sync secrétaire to mock_users (same store used by AuthSystem).
 * Each secrétaire becomes a user with role="secretaire".
 */
const syncToMockUsers = (secretaires) => {
  // 1. Charger la liste globale des utilisateurs
  const users = load("mock_users", []);
  
  secretaires.forEach(sec => {
    if (!sec.password) return; 

    const idx = users.findIndex(u => u.email === sec.email);
    
    // On prépare l'objet pour qu'il soit compatible avec AuthSystem
    const userData = {
      id: sec.id,
      nom: sec.nom,       // Changé 'name' en 'nom' pour match avec votre schéma
      prenom: "Secrétaire", 
      email: sec.email,
      role: "secretaire",
      password: sec.password,
      statut_compte: sec.statut === "Actif"
    };

    if (idx >= 0) {
      users[idx] = { ...users[idx], ...userData };
    } else {
      users.push(userData);
    }
  });

  // 2. Sauvegarder la base de données globale
  store("mock_users", users);
};

// ── Sub-components ────────────────────────────────────────────
const initials = name => name.replace("Dr. ","").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

const Toast = ({ msg }) => (
  <div style={{ position:"fixed",bottom:28,right:28,zIndex:999,background:"#16302b",color:"#fff",borderRadius:14,padding:"12px 20px",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:8,boxShadow:"0 8px 30px rgba(0,0,0,0.18)" }}>
    <CheckCircle size={16} color={G_MID}/> {msg}
  </div>
);

const Field = ({ label, icon:Icon, value, onChange, placeholder, half, type="text" }) => (
  <div style={{ display:"flex",flexDirection:"column",gap:6,flex:half?"1 1 45%":"1 1 100%" }}>
    {label && <label style={{ fontSize:13,fontWeight:600,color:"#374040" }}>{label}</label>}
    <div style={{ position:"relative" }}>
      {Icon && <Icon size={14} color="#9ab0aa" style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)" }}/>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%",boxSizing:"border-box",padding:Icon?"10px 14px 10px 34px":"10px 14px",borderRadius:10,border:"1px solid #e0eae8",background:"#f8fbfa",fontSize:14,color:"#16302b",outline:"none",fontFamily:"inherit",transition:"border 0.15s" }}
        onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor="#e0eae8"}/>
    </div>
  </div>
);

const Section = ({ icon:Icon, iconBg, iconColor, title, subtitle, action, children }) => (
  <div style={{ background:"#fff",borderRadius:18,padding:"22px 26px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",marginBottom:16 }}>
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18 }}>
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ background:iconBg||G_LIGHT,borderRadius:10,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Icon size={16} color={iconColor||G}/>
        </div>
        <div>
          <div style={{ fontSize:15,fontWeight:700,color:"#16302b" }}>{title}</div>
          {subtitle && <div style={{ fontSize:12,color:"#8aada8",marginTop:1 }}>{subtitle}</div>}
        </div>
      </div>
      {action}
    </div>
    {children}
  </div>
);

// ── Password strength ─────────────────────────────────────────
const strength = pw => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 6)            s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw))  s++;
  return s;
};
const strengthLabel = s => ["","Faible","Moyen","Bon","Fort"][s] || "";
const strengthColor = s => ["","#e03150","#e0a020","#4f6ef7",G][s] || G;

function PasswordField({ label, value, onChange, placeholder, showStrength }) {
  const [show, setShow] = useState(false);
  const s = strength(value);
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
      <label style={{ fontSize:13,fontWeight:600,color:"#374040" }}>{label}</label>
      <div style={{ position:"relative" }}>
        <Lock size={14} color="#9ab0aa" style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)" }}/>
        <input
          type={show?"text":"password"} value={value} onChange={e=>onChange(e.target.value)}
          placeholder={placeholder||"••••••••"}
          style={{ width:"100%",boxSizing:"border-box",padding:"10px 40px 10px 34px",borderRadius:10,border:"1px solid #e0eae8",background:"#f8fbfa",fontSize:14,color:"#16302b",outline:"none",fontFamily:"inherit",transition:"border 0.15s" }}
          onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor="#e0eae8"}
        />
        <div onClick={()=>setShow(v=>!v)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",cursor:"pointer",color:"#9ab0aa" }}>
          {show ? <EyeOff size={15}/> : <Eye size={15}/>}
        </div>
      </div>
      {showStrength && value && (
        <div>
          <div style={{ display:"flex",gap:4,marginTop:4 }}>
            {[1,2,3,4].map(n=>(
              <div key={n} style={{ flex:1,height:4,borderRadius:2,background:s>=n?strengthColor(s):"#e0eae8",transition:"background 0.3s" }}/>
            ))}
          </div>
          <div style={{ fontSize:11,color:strengthColor(s),fontWeight:600,marginTop:3 }}>
            Force : {strengthLabel(s)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Secretary modal WITH password ────────────────────────────
function SecretaireModal({ existing, onSave, onClose }) {
  const isEdit = !!existing;
  const [form, setForm] = useState({
    nom:"", email:"", tel:"", statut:"Actif", password:"", confirmPassword:"",
    ...(existing || {}),
    password: "",       // always blank on open for security
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const set = k => v => setForm(f=>({...f,[k]:v}));

  const handleSave = () => {
    if (!form.nom.trim())   return setError("Le nom est requis.");
    if (!form.email.trim()) return setError("L'email est requis.");

    // Password validation — required on create, optional on edit
    if (!isEdit || form.password) {
      if (!form.password)               return setError("Le mot de passe est requis.");
      if (form.password.length < 6)     return setError("Minimum 6 caractères.");
      if (form.password !== form.confirmPassword) return setError("Les mots de passe ne correspondent pas.");
    }

    setError("");
    const saved = { ...form };
    if (isEdit && !form.password) {
      // Keep existing password if not changed
      saved.password = existing.password || "";
    }
    delete saved.confirmPassword;
    onSave(saved);
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <div style={{ background:"#fff",borderRadius:20,padding:"28px",width:460,boxShadow:"0 20px 60px rgba(0,0,0,0.18)",maxHeight:"90vh",overflowY:"auto" }}>

        {/* Modal header */}
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:22 }}>
          <div style={{ background:G_LIGHT,borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center" }}>
            {isEdit ? <KeyRound size={17} color={G}/> : <UserPlus size={17} color={G}/>}
          </div>
          <div>
            <div style={{ fontSize:16,fontWeight:700,color:"#16302b" }}>{isEdit?"Modifier la secrétaire":"Ajouter une secrétaire"}</div>
            <div style={{ fontSize:12,color:"#8aada8",marginTop:1 }}>Accès au système de gestion</div>
          </div>
        </div>

        {error && (
          <div style={{ background:"#fff0f2",color:"#d93050",border:"1px solid #ffd0d8",borderRadius:10,padding:"10px 14px",fontSize:13,marginBottom:16 }}>
            {error}
          </div>
        )}

        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {/* Infos */}
          <div style={{ fontSize:12,fontWeight:700,color:"#8aada8",letterSpacing:"0.5px",textTransform:"uppercase",paddingBottom:4,borderBottom:"1px solid #f0f4f2" }}>
            Informations personnelles
          </div>
          <Field label="Nom complet" value={form.nom} onChange={set("nom")} placeholder="Marie Dupont"/>
          <Field label="Email" icon={Mail} value={form.email} onChange={set("email")} placeholder="marie@cabinet.fr"/>
          <Field label="Téléphone" icon={Phone} value={form.tel} onChange={set("tel")} placeholder="+33 6 00 00 00 00"/>
          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            <label style={{ fontSize:13,fontWeight:600,color:"#374040" }}>Statut</label>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ position:"relative",flex:1 }}>
                <ShieldCheck size={14} color="#9ab0aa" style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)" }}/>
                <select value={form.statut} onChange={e=>set("statut")(e.target.value)} style={{ width:"100%",padding:"10px 14px 10px 34px",borderRadius:10,border:"1px solid #e0eae8",background:"#f8fbfa",fontSize:14,color:"#16302b",outline:"none",fontFamily:"inherit",cursor:"pointer",appearance:"none" }}>
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
              <div style={{ background:form.statut==="Actif"?G_LIGHT:"#f3f4f6",color:form.statut==="Actif"?G:"#6b7280",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:700,flexShrink:0 }}>
                {form.statut}
              </div>
            </div>
          </div>

          {/* Password section */}
          <div style={{ fontSize:12,fontWeight:700,color:"#8aada8",letterSpacing:"0.5px",textTransform:"uppercase",paddingBottom:4,borderBottom:"1px solid #f0f4f2",marginTop:4 }}>
            {isEdit ? "Changer le mot de passe (optionnel)" : "Mot de passe de connexion"}
          </div>

          {isEdit && (
            <div style={{ background:"#fff8e6",border:"1px solid #ffe4a0",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#c47f00",display:"flex",alignItems:"center",gap:6 }}>
              <Lock size={13}/> Laissez vide pour conserver le mot de passe actuel
            </div>
          )}

          <PasswordField
            label={isEdit ? "Nouveau mot de passe" : "Mot de passe"}
            value={form.password}
            onChange={set("password")}
            showStrength
          />
          <PasswordField
            label="Confirmer le mot de passe"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            placeholder="••••••••"
          />

          {/* Auth preview */}
          {(form.email || form.password) && (
            <div style={{ background:G_LIGHT,borderRadius:12,padding:"12px 16px",border:`1px solid ${G}22` }}>
              <div style={{ fontSize:11,fontWeight:700,color:G,letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:8 }}>
                Accès créé dans le système
              </div>
              <div style={{ fontSize:13,color:"#374040" }}><span style={{ color:"#8aada8" }}>Email :</span> <strong>{form.email||"—"}</strong></div>
              <div style={{ fontSize:13,color:"#374040",marginTop:4 }}><span style={{ color:"#8aada8" }}>Rôle :</span> <strong style={{ color:G }}>Secrétaire</strong></div>
              <div style={{ fontSize:13,color:"#374040",marginTop:4 }}><span style={{ color:"#8aada8" }}>Mot de passe :</span> <strong>{form.password?"●".repeat(Math.min(form.password.length,8)):"non défini"}</strong></div>
            </div>
          )}
        </div>

        <div style={{ display:"flex",gap:10,marginTop:22 }}>
          <button onClick={onClose} style={{ flex:1,padding:"12px",borderRadius:12,border:"1px solid #dde8e6",background:"#fff",fontSize:14,fontWeight:600,color:"#374040",cursor:"pointer" }}>
            Annuler
          </button>
          <button onClick={handleSave} style={{ flex:2,padding:"12px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${G},${G_DARK})`,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            <Save size={15}/> {isEdit?"Enregistrer":"Créer le compte"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Row ───────────────────────────────────────────────────────
function SecretaireRow({ sec, odd, onEdit, onDelete }) {
  const [hov,setHov]=useState(false);
  const active = sec.statut==="Actif";
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"grid",gridTemplateColumns:"2fr 2.5fr 2fr 1.2fr 1fr",gap:8,alignItems:"center",padding:"13px 12px",borderRadius:12,background:hov?G_LIGHT:odd?"#fafcfb":"#fff",transition:"background 0.15s",marginBottom:2 }}>
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#4f6ef7,#7b9ef7)",color:"#fff",fontWeight:800,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative" }}>
          {sec.nom.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
          {sec.password && (
            <div style={{ position:"absolute",bottom:-2,right:-2,width:14,height:14,borderRadius:"50%",background:G,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Lock size={7} color="#fff"/>
            </div>
          )}
        </div>
        <div>
          <div style={{ fontWeight:700,fontSize:14,color:"#16302b" }}>{sec.nom}</div>
          {!sec.password && <div style={{ fontSize:11,color:"#e0a020",fontWeight:600 }}>⚠ Sans mot de passe</div>}
        </div>
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:13,color:"#374040" }}><Mail size={12} color="#9ab0aa"/>{sec.email}</div>
      <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:13,color:"#374040" }}><Phone size={12} color="#9ab0aa"/>{sec.tel}</div>
      <div>
        <span style={{ background:active?G_LIGHT:"#f3f4f6",color:active?G:"#6b7280",borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:700 }}>{sec.statut}</span>
      </div>
      <div style={{ display:"flex",justifyContent:"flex-end",gap:6 }}>
        <ActionBtn onClick={onEdit} color="#4f6ef7" hoverBg="#eef0ff"><Pencil size={14}/></ActionBtn>
        <ActionBtn onClick={onDelete} color="#e03150" hoverBg="#fff0f2"><Trash2 size={14}/></ActionBtn>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, color, hoverBg, children }) {
  const [h,setH]=useState(false);
  return <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ background:h?hoverBg:"transparent",border:"none",borderRadius:8,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",color,cursor:"pointer",transition:"all 0.15s" }}>{children}</button>;
}

// ── Main ──────────────────────────────────────────────────────
export default function ProfilMedecin() {
  const [profile,     setProfile]     = useState(() => load("medecin_profile", DEFAULT_PROFILE));
  const [secretaires, setSecretaires] = useState(() => load("medecin_secretaires", DEFAULT_SECRETAIRES));
  const [toast,       setToast]       = useState("");
  const [modal,       setModal]       = useState(null);
  const [editingSec,  setEditingSec]  = useState(null);

  useEffect(() => { store("medecin_profile", profile); }, [profile]);
  useEffect(() => {
    store("medecin_secretaires", secretaires);
    syncToMockUsers(secretaires);
  }, [secretaires]);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""),3000); };
  const setP = k => v => setProfile(p=>({...p,[k]:v}));

  const toggleSpec = spec =>
    setProfile(p=>({ ...p, specialites: p.specialites.includes(spec) ? p.specialites.filter(s=>s!==spec) : [...p.specialites, spec] }));

  const handleSaveProfile = () => { store("medecin_profile", profile); showToast("Profil sauvegardé avec succès"); };

  const handleSaveSecretaire = form => {
    if (editingSec) {
      setSecretaires(ss => ss.map(s => s.id===editingSec.id ? { ...s, ...form } : s));
      showToast("Secrétaire modifiée — accès mis à jour");
    } else {
      setSecretaires(ss => [...ss, { ...form, id: Date.now() }]);
      showToast("Secrétaire créée — accès enregistré");
    }
    setModal(null); setEditingSec(null);
  };

  const handleDeleteSec = id => {
    const sec = secretaires.find(s=>s.id===id);
    if (sec) {
      // Remove from mock_users too
      const users = load("mock_users", []);
      store("mock_users", users.filter(u=>u.email!==sec.email));
    }
    setSecretaires(ss => ss.filter(s=>s.id!==id));
    showToast("Secrétaire et accès supprimés");
  };

  const withPassword = secretaires.filter(s=>s.password).length;
  const STATS = [
    { label:"Patients suivis",     value:"1,284" },
    { label:"Consultations",       value:"3,452" },
    { label:"Années d'expérience", value:"12 ans"},
  ];

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif",background:"#f3f7f6",minHeight:"100vh",padding:"28px 28px 48px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:24,fontWeight:800,color:"#16302b" }}>Profil Médecin</div>
        <div style={{ fontSize:13,color:"#8aada8",marginTop:3 }}>Gérez les informations de votre cabinet médical</div>
      </div>

      <div style={{ display:"flex",gap:18,alignItems:"flex-start",flexWrap:"wrap" }}>
        {/* Left */}
        <div style={{ width:280,flexShrink:0,display:"flex",flexDirection:"column",gap:16 }}>
          <div style={{ background:"#fff",borderRadius:18,padding:"28px 22px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",textAlign:"center" }}>
            <div style={{ position:"relative",display:"inline-block",marginBottom:14 }}>
              <div style={{ width:80,height:80,borderRadius:"50%",background:`linear-gradient(135deg,${G},${G_MID})`,color:"#fff",fontWeight:800,fontSize:26,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 16px ${G}40` }}>
                {initials(profile.nom)}
              </div>
              <div style={{ position:"absolute",bottom:2,right:2,width:24,height:24,borderRadius:"50%",background:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:`2px solid ${G_LIGHT}` }}>
                <Camera size={11} color={G}/>
              </div>
            </div>
            <div style={{ fontSize:17,fontWeight:800,color:"#16302b" }}>{profile.nom}</div>
            <div style={{ fontSize:13,color:"#8aada8",marginTop:3 }}>{profile.specialite}</div>
            <div style={{ display:"flex",justifyContent:"center",gap:3,marginTop:10 }}>
              {[1,2,3,4,5].map(n=><Star key={n} size={16} fill={n<=profile.note?"#f0b429":"none"} color={n<=profile.note?"#f0b429":"#d0dbd9"} strokeWidth={1.5}/>)}
            </div>
            <div style={{ fontSize:12,color:"#8aada8",marginTop:4 }}>Note moyenne : {profile.note}.0/5</div>
          </div>

          <div style={{ background:"#fff",borderRadius:18,padding:"20px 22px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize:14,fontWeight:700,color:"#16302b",marginBottom:14 }}>Statistiques</div>
            {STATS.map(s=>(
              <div key={s.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid #f0f4f2" }}>
                <span style={{ fontSize:13,color:"#7a9e98" }}>{s.label}</span>
                <span style={{ fontSize:14,fontWeight:800,color:"#16302b" }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Access summary */}
          <div style={{ background:`linear-gradient(135deg,${G},${G_DARK})`,borderRadius:18,padding:"18px 20px",boxShadow:`0 4px 14px ${G}45` }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
              <Lock size={15} color="rgba(255,255,255,0.8)"/>
              <span style={{ fontSize:13,fontWeight:700,color:"#fff" }}>Accès secrétaires</span>
            </div>
            <div style={{ fontSize:28,fontWeight:800,color:"#fff",lineHeight:1 }}>{withPassword}</div>
            <div style={{ fontSize:12,color:"rgba(255,255,255,0.75)",marginTop:4 }}>
              sur {secretaires.length} avec mot de passe
            </div>
            {secretaires.length - withPassword > 0 && (
              <div style={{ marginTop:10,background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"6px 10px",fontSize:12,color:"#fff" }}>
                ⚠ {secretaires.length - withPassword} sans accès configuré
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div style={{ flex:"1 1 500px" }}>
          <Section icon={Building2} title="Informations du cabinet">
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              <Field label="Nom du cabinet" icon={Building2} value={profile.cabinetNom} onChange={setP("cabinetNom")} placeholder="Cabinet Médical"/>
              <Field label="Email" icon={Mail} value={profile.email} onChange={setP("email")} placeholder="contact@cabinet.fr"/>
              <Field label="Adresse" icon={MapPin} value={profile.adresse} onChange={setP("adresse")} placeholder="15 Rue de la Paix"/>
              <div style={{ display:"flex",gap:14 }}>
                <Field label="Localisation" value={profile.localisation} onChange={setP("localisation")} placeholder="Paris 8ème" half/>
                <Field label="Ville" value={profile.ville} onChange={setP("ville")} placeholder="Paris" half/>
              </div>
            </div>
            <button onClick={handleSaveProfile} style={{ marginTop:18,background:`linear-gradient(135deg,${G},${G_DARK})`,border:"none",borderRadius:12,padding:"12px 22px",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:`0 4px 14px ${G}45` }}>
              <Save size={15}/> Sauvegarder les modifications
            </button>
          </Section>

          <Section icon={Award} iconBg="#f3f0ff" iconColor="#9b59b6" title="Spécialités médicales">
            <div style={{ display:"flex",flexWrap:"wrap",gap:10 }}>
              {SPECIALITES.map(spec=>{
                const active = profile.specialites.includes(spec);
                return <button key={spec} onClick={()=>toggleSpec(spec)} style={{ padding:"8px 16px",borderRadius:20,border:"1px solid",borderColor:active?G:"#dde8e6",background:active?G:"#fff",color:active?"#fff":"#374040",fontSize:13,fontWeight:active?700:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.15s" }}>
                  {active && <CheckCircle size={13}/>}{spec}
                </button>;
              })}
            </div>
          </Section>

          <Section
            icon={Users} iconBg="#eef0ff" iconColor="#4f6ef7"
            title="Gestion des secrétaires"
            subtitle="Gérez les comptes et accès des secrétaires du cabinet"
            action={
              <button onClick={()=>{setEditingSec(null);setModal("add");}} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:20,border:`1px solid ${G}`,background:"#fff",color:G,fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.background=G_LIGHT} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                <UserPlus size={14}/> Ajouter secrétaire
              </button>
            }
          >
            <div style={{ display:"grid",gridTemplateColumns:"2fr 2.5fr 2fr 1.2fr 1fr",gap:8,padding:"8px 12px",marginBottom:4 }}>
              {["NOM","EMAIL","TÉLÉPHONE","STATUT","ACTIONS"].map(h=>(
                <div key={h} style={{ fontSize:11,fontWeight:700,color:"#8aada8",letterSpacing:"0.6px",textAlign:h==="ACTIONS"?"right":"left" }}>{h}</div>
              ))}
            </div>
            {secretaires.map((s,i)=>(
              <SecretaireRow key={s.id} sec={s} odd={i%2===0}
                onEdit={()=>{setEditingSec(s);setModal("edit");}}
                onDelete={()=>handleDeleteSec(s.id)}
              />
            ))}
          </Section>
        </div>
      </div>

      {(modal==="add"||modal==="edit") && (
        <SecretaireModal
          existing={editingSec}
          onSave={handleSaveSecretaire}
          onClose={()=>{setModal(null);setEditingSec(null);}}
        />
      )}

      {toast && <Toast msg={toast}/>}
    </div>
  );
}