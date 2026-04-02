import { useState } from "react";
import {
  User, Stethoscope, FileText, Save,
  Calendar, Clock, ChevronDown, CheckCircle2,
  AlertTriangle, Pill, Activity, Heart,
} from "lucide-react";

const G       = "#2E8B7F";
const G_DARK  = "#1f6259";
const G_LIGHT = "#e8f5f3";
const G_MID   = "#5AADA3";

const PATIENTS = [
  "Sophie Martin","Marc Leblanc","Claire Moreau","Pierre Garnier",
  "Alice Fontaine","Thomas Rousseau","Emma Dubois","Lucas Bernard",
];

const TYPES = [
  "Consultation générale","Bilan sanguin","Vaccination","Suivi chronique",
  "ECG","Radiologie","Urgence","Pédiatrie","Cardiologie","Contrôle",
];

const TYPE_CFG = {
  "Consultation générale": { color:"#2E8B7F", bg:G_LIGHT },
  "Bilan sanguin":         { color:"#4f6ef7", bg:"#eef0ff" },
  "Suivi":                 { color:"#2E8B7F", bg:G_LIGHT },
  "Urgence":               { color:"#d93050", bg:"#fff0f2" },
  "Contrôle":              { color:"#9b59b6", bg:"#f5f0ff" },
  "Radiologie":            { color:"#4f6ef7", bg:"#eef0ff" },
  "Vaccination":           { color:"#2da89a", bg:"#e8f5f3" },
  "ECG":                   { color:"#e08030", bg:"#fff8e6" },
  "default":               { color:"#374040", bg:"#f3f7f6" },
};
const getTypeCfg = t => {
  for (const k of Object.keys(TYPE_CFG)) if(t&&t.includes(k)) return TYPE_CFG[k];
  return TYPE_CFG.default;
};

const HISTORY = {
  "Sophie Martin": [
    { id:1, date:"28/02/2026", doctor:"Dr. Dupont",  type:"Consultation générale", note:"Patient présente des symptômes grippaux. Prescrit du paracétamol et repos." },
    { id:2, date:"15/02/2026", doctor:"Dr. Bernard", type:"Suivi",                 note:"Contrôle post-opératoire. Cicatrisation normale. Prochain RDV dans 1 mois." },
    { id:3, date:"03/02/2026", doctor:"Dr. Petit",   type:"Urgence",               note:"Douleur abdominale aiguë. Examens complémentaires prescrits. Surveillance nécessaire." },
    { id:4, date:"20/01/2026", doctor:"Dr. Dupont",  type:"Contrôle",              note:"Tension artérielle stable. Traitement maintenu. Bonne évolution générale." },
    { id:5, date:"05/01/2026", doctor:"Dr. Bernard", type:"Bilan sanguin",          note:"Résultats dans les normes. Légère carence en vitamine D. Supplémentation conseillée." },
  ],
  "Marc Leblanc": [
    { id:1, date:"25/02/2026", doctor:"Dr. Bernard", type:"Bilan sanguin",  note:"Cholestérol légèrement élevé. Recommandation alimentaire donnée." },
    { id:2, date:"10/01/2026", doctor:"Dr. Dupont",  type:"Consultation générale", note:"Fatigue chronique. Bilan complet prescrit." },
  ],
  "Claire Moreau": [
    { id:1, date:"20/02/2026", doctor:"Dr. Dupont",  type:"Suivi",     note:"Suivi cardio régulier. ECG normal. Prochaine consultation dans 3 mois." },
    { id:2, date:"08/01/2026", doctor:"Dr. Petit",   type:"ECG",       note:"Rythme cardiaque normal. Pas d'anomalie détectée." },
  ],
};
const DEFAULT_HISTORY = [
  { id:1, date:"01/03/2026", doctor:"Dr. Dupont",  type:"Consultation générale", note:"Première consultation. Bilan général satisfaisant." },
];

const Toast = ({ msg }) => (
  <div style={{ position:"fixed",bottom:28,right:28,zIndex:999,background:"#16302b",color:"#fff",borderRadius:14,padding:"12px 20px",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:8,boxShadow:"0 8px 30px rgba(0,0,0,0.18)" }}>
    <CheckCircle2 size={16} color={G_MID}/> {msg}
  </div>
);

const TypeBadge = ({ type }) => {
  const c = getTypeCfg(type);
  return <span style={{ background:c.bg,color:c.color,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700,whiteSpace:"nowrap" }}>{type}</span>;
};

export default function DossierMedical() {
  const [patient, setPatient]   = useState("Sophie Martin");
  const [type, setType]         = useState("Consultation générale");
  const [note, setNote]         = useState("");
  const [history, setHistory]   = useState(HISTORY);
  const [toast, setToast]       = useState("");
  const [patientOpen, setPatientOpen] = useState(false);
  const [typeOpen, setTypeOpen]       = useState(false);

  const currentHistory = history[patient] || DEFAULT_HISTORY;

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""),3000); };

  const handleSave = () => {
    if (!note.trim()) return;
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("fr-FR"),
      doctor: "Dr. Dupont",
      type,
      note: note.trim(),
    };
    setHistory(h => ({ ...h, [patient]: [entry, ...(h[patient]||DEFAULT_HISTORY)] }));
    setNote("");
    showToast("Compte-rendu enregistré avec succès");
  };

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#f3f7f6", minHeight:"100vh", padding:"28px 28px 48px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:24, fontWeight:800, color:"#16302b" }}>Dossier Médical</div>
        <div style={{ fontSize:13, color:"#8aada8", marginTop:3 }}>Gestion des consultations et compte-rendus médicaux</div>
      </div>

      {/* Patient selector */}
      <div style={{ background:"#fff", borderRadius:18, padding:"18px 22px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", marginBottom:20, position:"relative" }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#374040", marginBottom:10 }}>Sélectionner un patient</div>
        <div onClick={()=>setPatientOpen(o=>!o)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 16px", borderRadius:12, border:"1px solid #e0eae8", background:"#f8fbfa", cursor:"pointer", userSelect:"none" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${G},${G_MID})`,color:"#fff",fontWeight:800,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              {patient.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
            </div>
            <span style={{ fontSize:15, fontWeight:600, color:"#16302b" }}>{patient}</span>
          </div>
          <ChevronDown size={16} color="#8aada8" style={{ transform:patientOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}/>
        </div>
        {patientOpen && (
          <div style={{ position:"absolute", left:22, right:22, top:"100%", marginTop:4, background:"#fff", borderRadius:14, boxShadow:"0 8px 30px rgba(0,0,0,0.12)", zIndex:50, overflow:"hidden", border:"1px solid #edf2f1" }}>
            {PATIENTS.map(p=>(
              <div key={p} onClick={()=>{setPatient(p);setPatientOpen(false);}} style={{ padding:"12px 16px", fontSize:14, fontWeight:p===patient?700:500, color:p===patient?G:"#374040", background:p===patient?G_LIGHT:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"background 0.12s" }}
                onMouseEnter={e=>{ if(p!==patient) e.currentTarget.style.background="#f5f8f7"; }}
                onMouseLeave={e=>{ if(p!==patient) e.currentTarget.style.background="#fff"; }}>
                <div style={{ width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${G},${G_MID})`,color:"#fff",fontWeight:800,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  {p.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                </div>
                {p}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main layout */}
      <div style={{ display:"flex", gap:18, alignItems:"flex-start", flexWrap:"wrap" }}>

        {/* Left column */}
        <div style={{ flex:"1 1 560px", display:"flex", flexDirection:"column", gap:16 }}>

          {/* Type de consultation */}
          <div style={{ background:"#fff", borderRadius:18, padding:"22px 26px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ background:"#f3f0ff", borderRadius:10, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Stethoscope size={16} color="#9b59b6"/>
              </div>
              <span style={{ fontSize:15, fontWeight:700, color:"#16302b" }}>Type de consultation</span>
            </div>
            <div onClick={()=>setTypeOpen(o=>!o)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 16px", borderRadius:12, border:"1px solid #e0eae8", background:"#f8fbfa", cursor:"pointer" }}>
              <span style={{ fontSize:14, color:"#16302b", fontWeight:500 }}>{type}</span>
              <ChevronDown size={15} color="#8aada8" style={{ transform:typeOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}/>
            </div>
            {typeOpen && (
              <div style={{ position:"absolute", left:26, right:26, top:"calc(100% - 8px)", background:"#fff", borderRadius:14, boxShadow:"0 8px 30px rgba(0,0,0,0.12)", zIndex:50, overflow:"hidden", border:"1px solid #edf2f1" }}>
                {TYPES.map(t=>(
                  <div key={t} onClick={()=>{setType(t);setTypeOpen(false);}} style={{ padding:"11px 16px", fontSize:14, fontWeight:t===type?700:500, color:t===type?G:"#374040", background:t===type?G_LIGHT:"#fff", cursor:"pointer", transition:"background 0.12s" }}
                    onMouseEnter={e=>{ if(t!==type) e.currentTarget.style.background="#f5f8f7"; }}
                    onMouseLeave={e=>{ if(t!==type) e.currentTarget.style.background="#fff"; }}>
                    {t}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compte rendu */}
          <div style={{ background:"#fff", borderRadius:18, padding:"22px 26px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ background:G_LIGHT, borderRadius:10, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <FileText size={16} color={G}/>
              </div>
              <span style={{ fontSize:15, fontWeight:700, color:"#16302b" }}>Compte rendu de consultation</span>
            </div>
            <textarea
              value={note}
              onChange={e=>setNote(e.target.value)}
              placeholder="Écrivez le compte-rendu de la consultation ici..."
              rows={8}
              style={{ width:"100%", padding:"14px 16px", borderRadius:12, border:"1px solid #e0eae8", background:"#f8fbfa", fontSize:14, color:"#16302b", resize:"vertical", outline:"none", fontFamily:"inherit", lineHeight:1.6, transition:"border 0.15s" }}
              onFocus={e=>e.target.style.borderColor=G}
              onBlur={e=>e.target.style.borderColor="#e0eae8"}
            />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14 }}>
              <span style={{ fontSize:12, color:"#9ab0aa" }}>{note.length} caractère{note.length!==1?"s":""}</span>
              <button onClick={handleSave} style={{ background:note.trim()?`linear-gradient(135deg,${G},${G_DARK})`:"#d0dbd9", border:"none", borderRadius:12, padding:"12px 22px", color:"#fff", fontWeight:700, fontSize:14, cursor:note.trim()?"pointer":"default", display:"flex", alignItems:"center", gap:8, boxShadow:note.trim()?`0 4px 16px ${G}40`:"none", transition:"all 0.2s" }}>
                <Save size={15}/> Enregistrer le compte-rendu
              </button>
            </div>
          </div>

          
        </div>

        {/* Right column — history */}
        <div style={{ width:340, flexShrink:0 }}>
          <div style={{ background:"#fff", borderRadius:18, padding:"22px 24px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{ background:"#eef0ff", borderRadius:10, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Clock size={16} color="#4f6ef7"/>
              </div>
              <span style={{ fontSize:15, fontWeight:700, color:"#16302b" }}>Historique des séances</span>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {currentHistory.map((entry, i)=>(
                <div key={entry.id} style={{ paddingBottom:20, marginBottom:i<currentHistory.length-1?4:0, borderBottom:i<currentHistory.length-1?"1px solid #f0f4f2":"none" }}>
                  {/* Date + type */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <Calendar size={13} color="#8aada8"/>
                      <span style={{ fontSize:13, fontWeight:700, color:"#374040" }}>{entry.date}</span>
                    </div>
                    <TypeBadge type={entry.type}/>
                  </div>
                  {/* Doctor */}
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                    <User size={13} color="#8aada8"/>
                    <span style={{ fontSize:13, fontWeight:700, color:"#374040" }}>{entry.doctor}</span>
                  </div>
                  {/* Note */}
                  <div style={{ background:"#f8fbfa", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#555e5d", lineHeight:1.55, borderLeft:`3px solid ${getTypeCfg(entry.type).color}` }}>
                    {entry.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast}/>}
    </div>
  );
}