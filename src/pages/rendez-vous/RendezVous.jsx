import { useState, useMemo } from "react";
import {
  Search, CalendarPlus, Eye, Pencil, Trash2,
  ArrowLeft, User, Stethoscope, Calendar, Clock,
  Bell, Mail, Smartphone, Save, ChevronLeft,
  ChevronRight, MapPin, Star, CheckCircle2,
  AlertCircle, Ban,
} from "lucide-react";

const G       = "#2E8B7F";
const G_DARK  = "#1f6259";
const G_LIGHT = "#e8f5f3";
const G_MID   = "#5AADA3";

const PATIENTS  = ["Sophie Martin","Marc Leblanc","Claire Moreau","Pierre Garnier","Alice Fontaine","Thomas Rousseau","Emma Dubois","Lucas Bernard","Camille Petit","Julien Leroy"];
const MEDECINS  = ["Dr. Dupont","Dr. Bernard","Dr. Petit","Dr. Martin","Dr. Leroy"];
const TYPES_RDV = ["Consultation générale","Bilan sanguin","Vaccination","Suivi chronique","ECG","Radio","Urgence","Pédiatrie","Cardiologie"];
const TIME_SLOTS= ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30"];
const REGIONS   = ["Toutes","Paris","Lyon","Marseille","Bordeaux","Lille"];
const PER_PAGE  = 8;
const TABS      = ["Tous","Confirmés","En attente","Terminés","Annulés"];

const STATUS_CFG = {
  Confirmé:     { bg:"#e8f5f3", color:G,        dot:G        },
  "En attente": { bg:"#fff8e6", color:"#c47f00", dot:"#e0a020"},
  Terminé:      { bg:"#eef0ff", color:"#4f6ef7", dot:"#4f6ef7"},
  Annulé:       { bg:"#fff0f2", color:"#d93050", dot:"#d93050"},
};

const INITIAL_RDV = [
  { id:1,  patient:"Sophie Martin",   medecin:"Dr. Dupont",  date:"03 mars 2026", heure:"09:00", type:"Consultation",    statut:"Confirmé"   },
  { id:2,  patient:"Marc Leblanc",    medecin:"Dr. Bernard", date:"03 mars 2026", heure:"10:30", type:"Bilan sanguin",   statut:"En attente" },
  { id:3,  patient:"Claire Moreau",   medecin:"Dr. Dupont",  date:"03 mars 2026", heure:"11:00", type:"Suivi cardio",    statut:"Terminé"    },
  { id:4,  patient:"Pierre Garnier",  medecin:"Dr. Petit",   date:"03 mars 2026", heure:"14:00", type:"Consultation",    statut:"Annulé"     },
  { id:5,  patient:"Alice Fontaine",  medecin:"Dr. Bernard", date:"04 mars 2026", heure:"09:30", type:"Vaccination",     statut:"Confirmé"   },
  { id:6,  patient:"Thomas Rousseau", medecin:"Dr. Dupont",  date:"04 mars 2026", heure:"11:00", type:"Radio",           statut:"En attente" },
  { id:7,  patient:"Emma Dubois",     medecin:"Dr. Petit",   date:"04 mars 2026", heure:"14:30", type:"Consultation",    statut:"Confirmé"   },
  { id:8,  patient:"Lucas Bernard",   medecin:"Dr. Bernard", date:"05 mars 2026", heure:"10:00", type:"ECG",             statut:"Terminé"    },
  { id:9,  patient:"Camille Petit",   medecin:"Dr. Martin",  date:"05 mars 2026", heure:"11:30", type:"Pédiatrie",       statut:"Confirmé"   },
  { id:10, patient:"Julien Leroy",    medecin:"Dr. Leroy",   date:"06 mars 2026", heure:"09:00", type:"Cardiologie",     statut:"En attente" },
  { id:11, patient:"Sophie Martin",   medecin:"Dr. Dupont",  date:"06 mars 2026", heure:"14:00", type:"Suivi chronique", statut:"Annulé"     },
  { id:12, patient:"Marc Leblanc",    medecin:"Dr. Bernard", date:"07 mars 2026", heure:"10:30", type:"Urgence",         statut:"Confirmé"   },
];

const initials = name => name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
const emptyForm = () => ({ patient:"", medecin:"", region:"Toutes", noteMin:0, date:"", heure:"", type:"", notes:"", statut:"Confirmé", notifEmail:true, notifSMS:false });

// ── Components ─────────────────────────────────────────────────

const Toggle = ({ on, onChange }) => (
  <div onClick={()=>onChange(!on)} style={{ width:42,height:24,borderRadius:12,cursor:"pointer",background:on?G:"#d0dbd9",position:"relative",transition:"background 0.2s",flexShrink:0 }}>
    <div style={{ position:"absolute",top:3,left:on?21:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
  </div>
);

const StatusBadge = ({ statut }) => {
  const s = STATUS_CFG[statut]||STATUS_CFG["Confirmé"];
  return (
    <span style={{ display:"inline-flex",alignItems:"center",gap:5,background:s.bg,color:s.color,padding:"4px 11px",borderRadius:20,fontSize:12,fontWeight:700 }}>
      <span style={{ width:6,height:6,borderRadius:"50%",background:s.dot,flexShrink:0 }}/>{statut}
    </span>
  );
};

const ActBtn = ({ onClick, color, hoverBg, children }) => {
  const [h,setH]=useState(false);
  return <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ background:h?hoverBg:"transparent",border:"none",borderRadius:8,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",color,cursor:"pointer",transition:"all 0.15s" }}>{children}</button>;
};

const PageBtn = ({ onClick, disabled, active, children }) => (
  <button onClick={onClick} disabled={disabled} style={{ width:34,height:34,borderRadius:10,border:"1px solid",borderColor:active?G:"#dde8e6",background:active?G:"#fff",color:active?"#fff":disabled?"#ccc":"#374040",fontWeight:700,fontSize:13,cursor:disabled?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s" }}>{children}</button>
);

const Toast = ({ msg }) => (
  <div style={{ position:"fixed",bottom:28,right:28,zIndex:999,background:"#16302b",color:"#fff",borderRadius:14,padding:"12px 20px",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:8,boxShadow:"0 8px 30px rgba(0,0,0,0.18)" }}>
    <CheckCircle2 size={16} color={G_MID}/> {msg}
  </div>
);

const Section = ({ icon:Icon, iconBg, iconColor, title, children }) => (
  <div style={{ background:"#fff",borderRadius:18,padding:"22px 26px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",marginBottom:16 }}>
    <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
      <div style={{ background:iconBg||G_LIGHT,borderRadius:10,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center" }}>
        <Icon size={16} color={iconColor||G}/>
      </div>
      <span style={{ fontSize:15,fontWeight:700,color:"#16302b" }}>{title}</span>
    </div>
    {children}
  </div>
);

// ── Form ───────────────────────────────────────────────────────

function RDVForm({ rdv, onBack, onSave }) {
  const isEdit = !!rdv;
  const [form, setForm] = useState(isEdit ? { ...emptyForm(), patient:rdv.patient, medecin:rdv.medecin, date:rdv.date, heure:rdv.heure, type:rdv.type, statut:rdv.statut } : emptyForm());
  const set = k => v => setForm(f=>({...f,[k]:v}));

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif",background:"#f3f7f6",minHeight:"100vh",padding:"24px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:24 }}>
        <button onClick={onBack} style={{ background:"none",border:"none",cursor:"pointer",color:"#374040",padding:6,borderRadius:8 }}><ArrowLeft size={20}/></button>
        <div>
          <div style={{ fontSize:22,fontWeight:800,color:"#16302b" }}>{isEdit?"Modifier le rendez-vous":"Nouveau rendez-vous"}</div>
          <div style={{ fontSize:13,color:"#8aada8",marginTop:1 }}>Planifiez un rendez-vous médical</div>
        </div>
      </div>

      <div style={{ display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap" }}>
        {/* Left */}
        <div style={{ flex:"1 1 560px" }}>

          <Section icon={User} title="Participants">
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              {[{label:"Patient",key:"patient",Icon:User,opts:PATIENTS,ph:"Sélectionner un patient"},{label:"Médecin",key:"medecin",Icon:Stethoscope,opts:MEDECINS,ph:"Sélectionner un médecin"}].map(f=>(
                <div key={f.key} style={{ display:"flex",flexDirection:"column",gap:6 }}>
                  <label style={{ fontSize:13,fontWeight:600,color:"#374040" }}>{f.label} <span style={{color:"#e03150"}}>*</span></label>
                  <div style={{ position:"relative" }}>
                    <f.Icon size={14} color="#9ab0aa" style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}/>
                    <select value={form[f.key]} onChange={e=>set(f.key)(e.target.value)} style={{ width:"100%",padding:"10px 14px 10px 34px",borderRadius:10,border:"1px solid #e0eae8",background:"#f8fbfa",fontSize:14,color:form[f.key]?"#16302b":"#9ab0aa",outline:"none",fontFamily:"inherit",cursor:"pointer",appearance:"none" }}>
                      <option value="">{f.ph}</option>
                      {f.opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:11,fontWeight:700,color:"#8aada8",letterSpacing:"0.6px",marginBottom:12 }}>FILTRES</div>
              <div style={{ display:"flex",gap:16,alignItems:"flex-end" }}>
                <div style={{ width:160,display:"flex",flexDirection:"column",gap:6 }}>
                  <label style={{ fontSize:13,fontWeight:600,color:"#374040" }}>Région</label>
                  <div style={{ position:"relative" }}>
                    <MapPin size={14} color="#9ab0aa" style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}/>
                    <select value={form.region} onChange={e=>set("region")(e.target.value)} style={{ width:"100%",padding:"10px 14px 10px 34px",borderRadius:10,border:"1px solid #e0eae8",background:"#f8fbfa",fontSize:14,color:"#16302b",outline:"none",fontFamily:"inherit",appearance:"none" }}>
                      {REGIONS.map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                  <label style={{ fontSize:13,fontWeight:600,color:"#374040" }}>Note minimale</label>
                  <div style={{ display:"flex",gap:4 }}>
                    {[1,2,3,4,5].map(n=>(
                      <Star key={n} size={22} strokeWidth={1.5} color={n<=form.noteMin?"#f0b429":"#d0dbd9"} fill={n<=form.noteMin?"#f0b429":"none"} style={{ cursor:"pointer" }} onClick={()=>set("noteMin")(n===form.noteMin?0:n)}/>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section icon={Calendar} iconBg="#eef0ff" iconColor="#4f6ef7" title="Date et heure">
            <div style={{ display:"grid",gridTemplateColumns:"1fr 2fr",gap:20,alignItems:"start" }}>
              <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                <label style={{ fontSize:13,fontWeight:600,color:"#374040" }}>Date <span style={{color:"#e03150"}}>*</span></label>
                <div style={{ position:"relative" }}>
                  <Calendar size={14} color="#9ab0aa" style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)" }}/>
                  <input placeholder="jj/mm/aaaa" value={form.date} onChange={e=>set("date")(e.target.value)} style={{ width:"100%",boxSizing:"border-box",padding:"10px 14px 10px 34px",borderRadius:10,border:"1px solid #e0eae8",background:"#f8fbfa",fontSize:14,color:"#16302b",outline:"none",fontFamily:"inherit" }} onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor="#e0eae8"}/>
                </div>
              </div>
              <div>
                <label style={{ fontSize:13,fontWeight:600,color:"#374040" }}>Créneau horaire <span style={{color:"#e03150"}}>*</span></label>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:8 }}>
                  {TIME_SLOTS.map(t=>(
                    <button key={t} onClick={()=>set("heure")(t)} style={{ padding:"8px 4px",borderRadius:10,border:"1px solid",borderColor:form.heure===t?G:"#dde8e6",background:form.heure===t?G:"#f8fbfa",color:form.heure===t?"#fff":"#374040",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.15s" }}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section icon={Stethoscope} iconBg="#f3f0ff" iconColor="#9b59b6" title="Type de consultation">
            <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:16 }}>
              {TYPES_RDV.map(t=>(
                <button key={t} onClick={()=>set("type")(form.type===t?"":t)} style={{ padding:"7px 14px",borderRadius:20,border:"1px solid",borderColor:form.type===t?G:"#dde8e6",background:form.type===t?G_LIGHT:"#f8fbfa",color:form.type===t?G:"#374040",fontSize:13,fontWeight:form.type===t?700:500,cursor:"pointer",transition:"all 0.15s" }}>{t}</button>
              ))}
            </div>
            <label style={{ fontSize:13,fontWeight:600,color:"#374040",display:"block",marginBottom:6 }}>Notes (optionnel)</label>
            <textarea value={form.notes} onChange={e=>set("notes")(e.target.value)} placeholder="Informations complémentaires sur le rendez-vous..." rows={4} style={{ width:"100%",boxSizing:"border-box",padding:"10px 14px",borderRadius:10,border:"1px solid #e0eae8",background:"#f8fbfa",fontSize:14,color:"#16302b",resize:"vertical",outline:"none",fontFamily:"inherit" }} onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor="#e0eae8"}/>
          </Section>
        </div>

        {/* Right */}
        <div style={{ width:300,flexShrink:0,display:"flex",flexDirection:"column",gap:16 }}>
          <div style={{ background:"#fff",borderRadius:18,padding:"22px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize:15,fontWeight:700,color:"#16302b",marginBottom:14 }}>Statut du RDV</div>
            {[{k:"Confirmé",c:G},{k:"En attente",c:"#c47f00"},{k:"Annulé",c:"#d93050"}].map(s=>(
              <div key={s.k} onClick={()=>set("statut")(s.k)} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderRadius:12,marginBottom:8,border:`1.5px solid ${form.statut===s.k?G:"#edf2f1"}`,background:form.statut===s.k?G_LIGHT:"#fafcfb",cursor:"pointer",transition:"all 0.15s" }}>
                <span style={{ fontSize:14,fontWeight:600,color:"#374040" }}>{s.k}</span>
                <span style={{ fontSize:12,fontWeight:700,color:s.c }}>{s.k}</span>
              </div>
            ))}
          </div>

          <div style={{ background:"#fff",borderRadius:18,padding:"22px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
              <Bell size={16} color="#e0a020"/><span style={{ fontSize:15,fontWeight:700,color:"#16302b" }}>Notifications</span>
            </div>
            {[{k:"notifEmail",label:"Email",Icon:Mail},{k:"notifSMS",label:"SMS",Icon:Smartphone}].map(n=>(
              <div key={n.k} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}><n.Icon size={15} color="#8aada8"/><span style={{ fontSize:14,color:"#374040",fontWeight:500 }}>{n.label}</span></div>
                <Toggle on={form[n.k]} onChange={v=>set(n.k)(v)}/>
              </div>
            ))}
          </div>

          <button onClick={()=>onSave(form)} style={{ background:`linear-gradient(135deg,${G},${G_DARK})`,border:"none",borderRadius:14,padding:"14px",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 4px 16px ${G}50` }}>
            <Save size={16}/> {isEdit?"Enregistrer":"Prendre rendez-vous"}
          </button>
          <button onClick={onBack} style={{ background:"none",border:"none",color:"#8aada8",fontSize:14,fontWeight:600,cursor:"pointer",padding:"8px" }}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

// ── List ───────────────────────────────────────────────────────

function RDVList({ rdvs, onNew, onEdit, onDelete }) {
  const [tab,setTab]         = useState("Tous");
  const [search,setSearch]   = useState("");
  const [medFilter,setMedFilter] = useState("");
  const [page,setPage]       = useState(1);

  const counts = useMemo(()=>({
    Tous:rdvs.length,
    Confirmés:rdvs.filter(r=>r.statut==="Confirmé").length,
    "En attente":rdvs.filter(r=>r.statut==="En attente").length,
    Terminés:rdvs.filter(r=>r.statut==="Terminé").length,
    Annulés:rdvs.filter(r=>r.statut==="Annulé").length,
  }),[rdvs]);

  const filtered = useMemo(()=>rdvs.filter(r=>{
    const matchTab = tab==="Tous"||(tab==="Confirmés"&&r.statut==="Confirmé")||(tab==="En attente"&&r.statut==="En attente")||(tab==="Terminés"&&r.statut==="Terminé")||(tab==="Annulés"&&r.statut==="Annulé");
    const matchSearch = `${r.patient} ${r.medecin} ${r.type}`.toLowerCase().includes(search.toLowerCase());
    const matchMed = !medFilter||r.medecin===medFilter;
    return matchTab&&matchSearch&&matchMed;
  }),[rdvs,tab,search,medFilter]);

  const totalPages = Math.ceil(filtered.length/PER_PAGE);
  const slice = filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);

  const COLS = [{label:"PATIENT",w:"22%"},{label:"MÉDECIN",w:"13%"},{label:"DATE",w:"16%"},{label:"HEURE",w:"9%"},{label:"TYPE",w:"14%"},{label:"STATUT",w:"14%"},{label:"ACTIONS",w:"12%",right:true}];

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif",background:"#f3f7f6",minHeight:"100vh",padding:"28px 28px 48px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
        <div>
          <div style={{ fontSize:24,fontWeight:800,color:"#16302b" }}>Rendez-vous</div>
          <div style={{ fontSize:13,color:"#8aada8",marginTop:3 }}>{rdvs.length} rendez-vous trouvés</div>
        </div>
        <button onClick={onNew} style={{ background:`linear-gradient(135deg,${G},${G_DARK})`,border:"none",borderRadius:14,padding:"12px 22px",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:`0 4px 16px ${G}50` }}>
          <CalendarPlus size={16}/> Nouveau RDV
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex",gap:10,marginBottom:20,flexWrap:"wrap" }}>
        {TABS.map(t=>{
          const active=tab===t;
          return <button key={t} onClick={()=>{setTab(t);setPage(1);}} style={{ padding:"8px 16px",borderRadius:20,border:"1px solid",borderColor:active?G:"#dde8e6",background:active?G:"#fff",color:active?"#fff":"#374040",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.15s" }}>
            {t}<span style={{ background:active?"rgba(255,255,255,0.25)":G_LIGHT,color:active?"#fff":G,borderRadius:20,padding:"1px 8px",fontSize:12 }}>{counts[t]}</span>
          </button>;
        })}
      </div>

      {/* Filters */}
      <div style={{ background:"#fff",borderRadius:16,padding:"10px 16px",display:"flex",alignItems:"center",gap:12,marginBottom:20,boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
        <Search size={16} color="#9ab0aa"/>
        <input placeholder="Rechercher..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} style={{ flex:1,border:"none",outline:"none",fontSize:14,color:"#16302b",background:"transparent",fontFamily:"inherit" }}/>
        <div style={{ display:"flex",alignItems:"center",gap:6,borderLeft:"1px solid #edf2f1",paddingLeft:12 }}>
          <Calendar size={14} color="#9ab0aa"/>
          <input placeholder="jj/mm/aaaa" style={{ border:"none",outline:"none",fontSize:13,color:"#374040",background:"transparent",width:110,fontFamily:"inherit" }}/>
        </div>
        <select value={medFilter} onChange={e=>{setMedFilter(e.target.value);setPage(1);}} style={{ border:"1px solid #dde8e6",borderRadius:10,padding:"6px 12px",fontSize:13,color:"#374040",background:"#f8fbfa",outline:"none",fontFamily:"inherit",cursor:"pointer" }}>
          <option value="">Tous les médecins</option>
          {MEDECINS.map(m=><option key={m}>{m}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background:"#fff",borderRadius:18,boxShadow:"0 1px 6px rgba(0,0,0,0.06)",overflow:"hidden" }}>
        <div style={{ display:"flex",padding:"12px 20px",borderBottom:"1px solid #edf2f1" }}>
          {COLS.map(c=><div key={c.label} style={{ width:c.w,fontSize:11,fontWeight:700,color:"#8aada8",letterSpacing:"0.6px",textAlign:c.right?"right":"left" }}>{c.label}</div>)}
        </div>
        {slice.length===0&&<div style={{ padding:"40px",textAlign:"center",color:"#9ab0aa",fontSize:14 }}>Aucun rendez-vous trouvé</div>}
        {slice.map((r,i)=><RDVRow key={r.id} rdv={r} odd={i%2===0} onEdit={()=>onEdit(r)} onDelete={()=>onDelete(r.id)}/>)}
      </div>

      {totalPages>1&&(
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:20,padding:"0 4px" }}>
          <div style={{ fontSize:13,color:"#8aada8" }}>Affichage {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)} sur {filtered.length}</div>
          <div style={{ display:"flex",gap:6,alignItems:"center" }}>
            <PageBtn onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}><ChevronLeft size={14}/></PageBtn>
            {Array.from({length:totalPages},(_,i)=>i+1).map(n=><PageBtn key={n} active={n===page} onClick={()=>setPage(n)}>{n}</PageBtn>)}
            <PageBtn onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}><ChevronRight size={14}/></PageBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function RDVRow({ rdv:r, odd, onEdit, onDelete }) {
  const [hov,setHov]=useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ display:"flex",alignItems:"center",padding:"13px 20px",background:hov?G_LIGHT:odd?"#fafcfb":"#fff",borderBottom:"1px solid #f0f4f2",transition:"background 0.15s" }}>
      <div style={{ width:"22%",display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ width:36,height:36,borderRadius:"50%",flexShrink:0,background:`linear-gradient(135deg,${G},${G_MID})`,color:"#fff",fontWeight:800,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 8px ${G}35` }}>{initials(r.patient)}</div>
        <span style={{ fontWeight:700,fontSize:14,color:"#16302b" }}>{r.patient}</span>
      </div>
      <div style={{ width:"13%",fontSize:14,color:"#374040" }}>{r.medecin}</div>
      <div style={{ width:"16%",fontSize:14,color:"#374040" }}>{r.date}</div>
      <div style={{ width:"9%",fontSize:15,fontWeight:700,color:"#16302b" }}>{r.heure}</div>
      <div style={{ width:"14%",fontSize:14,color:"#374040" }}>{r.type}</div>
      <div style={{ width:"14%" }}><StatusBadge statut={r.statut}/></div>
      <div style={{ width:"12%",display:"flex",justifyContent:"flex-end",gap:4 }}>
        <ActBtn onClick={onEdit} color="#4f6ef7" hoverBg="#eef0ff"><Pencil size={15}/></ActBtn>
        <ActBtn onClick={onDelete} color="#e03150" hoverBg="#fff0f2"><Trash2 size={15}/></ActBtn>
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────

export default function RDV() {
  const [rdvs,setRdvs]     = useState(INITIAL_RDV);
  const [view,setView]     = useState("list");
  const [editing,setEditing] = useState(null);
  const [toast,setToast]   = useState("");

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""),3000); };

  const handleSave = form => {
    if (editing) {
      setRdvs(rs=>rs.map(r=>r.id===editing.id?{...r,patient:form.patient||r.patient,medecin:form.medecin||r.medecin,date:form.date||r.date,heure:form.heure||r.heure,type:form.type||r.type,statut:form.statut}:r));
      showToast("Rendez-vous modifié");
    } else {
      setRdvs(rs=>[...rs,{id:Date.now(),patient:form.patient,medecin:form.medecin,date:form.date||"À définir",heure:form.heure||"—",type:form.type||"Consultation",statut:form.statut}]);
      showToast("Rendez-vous créé");
    }
    setView("list"); setEditing(null);
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      {view==="list"&&<RDVList rdvs={rdvs} onNew={()=>{setEditing(null);setView("form");}} onEdit={r=>{setEditing(r);setView("form");}} onDelete={id=>{setRdvs(rs=>rs.filter(r=>r.id!==id));showToast("Rendez-vous supprimé");}}/>}
      {view==="form"&&<RDVForm rdv={editing} onBack={()=>{setView("list");setEditing(null);}} onSave={handleSave}/>}
      {toast&&<Toast msg={toast}/>}
    </>
  );
}