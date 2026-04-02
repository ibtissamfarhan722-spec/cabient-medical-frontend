import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

const G       = "#2E8B7F";
const G_DARK  = "#1f6259";
const G_LIGHT = "#e8f5f3";
const G_MID   = "#5AADA3";

// ── Type colors ───────────────────────────────────────────────
const TYPE_CFG = {
  Consultation: { color: "#fff", bg: G,        dot: G        },
  Bilan:        { color: "#fff", bg: "#2da89a", dot: "#2da89a"},
  Suivi:        { color: "#fff", bg: "#2da89a", dot: "#2da89a"},
  Radiologie:   { color: "#fff", bg: "#4f6ef7", dot: "#4f6ef7"},
  "En attente": { color: "#fff", bg: "#e0a020", dot: "#e0a020"},
  Spécialiste:  { color: "#fff", bg: "#9b59b6", dot: "#9b59b6"},
};
const typeOf = t => {
  if (!t) return "Consultation";
  if (t.includes("Bilan")) return "Bilan";
  if (t.includes("Suivi") || t.includes("cardio") || t.includes("ECG")) return "Suivi";
  if (t.includes("Radio")) return "Radiologie";
  if (t.includes("attente")) return "En attente";
  if (t.includes("Cardio") || t.includes("Spéc")) return "Spécialiste";
  return "Consultation";
};

// ── Data ──────────────────────────────────────────────────────
const RDVS = [
  { id:1,  day:3,  time:"09:00", name:"Sophie",  full:"Sophie Martin",  medecin:"Dr. Dupont",  type:"Consultation"   },
  { id:2,  day:3,  time:"10:30", name:"Marc",    full:"Marc Leblanc",   medecin:"Dr. Bernard", type:"Bilan sanguin"  },
  { id:3,  day:3,  time:"14:00", name:"Pierre",  full:"Pierre Garnier", medecin:"Dr. Petit",   type:"Suivi"          },
  { id:4,  day:4,  time:"09:30", name:"Alice",   full:"Alice Fontaine", medecin:"Dr. Bernard", type:"Vaccination"    },
  { id:5,  day:4,  time:"11:00", name:"Thomas",  full:"Thomas Rousseau",medecin:"Dr. Dupont",  type:"Radiologie"     },
  { id:6,  day:5,  time:"10:00", name:"Lucas",   full:"Lucas Bernard",  medecin:"Dr. Bernard", type:"ECG"            },
  { id:7,  day:5,  time:"14:30", name:"Emma",    full:"Emma Dubois",    medecin:"Dr. Petit",   type:"Consultation"   },
  { id:8,  day:5,  time:"16:00", name:"Camille", full:"Camille Petit",  medecin:"Dr. Martin",  type:"En attente"     },
  { id:9,  day:9,  time:"09:00", name:"Hugo",    full:"Hugo Renard",    medecin:"Dr. Dupont",  type:"Consultation"   },
  { id:10, day:10, time:"10:30", name:"Nadia",   full:"Nadia Bouali",   medecin:"Dr. Bernard", type:"Bilan sanguin"  },
  { id:11, day:10, time:"14:00", name:"Karim",   full:"Karim Mansouri", medecin:"Dr. Petit",   type:"En attente"     },
  { id:12, day:15, time:"09:00", name:"Sophie",  full:"Sophie Martin",  medecin:"Dr. Dupont",  type:"Consultation"   },
  { id:13, day:15, time:"11:30", name:"Marc",    full:"Marc Leblanc",   medecin:"Dr. Bernard", type:"Radiologie"     },
  { id:14, day:18, time:"10:00", name:"Claire",  full:"Claire Moreau",  medecin:"Dr. Dupont",  type:"Suivi cardio"   },
  { id:15, day:22, time:"14:00", name:"Pierre",  full:"Pierre Garnier", medecin:"Dr. Petit",   type:"Spécialiste"    },
  { id:16, day:22, time:"15:30", name:"Alice",   full:"Alice Fontaine", medecin:"Dr. Bernard", type:"Consultation"   },
];

const DAYS_FR  = ["DIM","LUN","MAR","MER","JEU","VEN","SAM"];
const MONTHS_FR= ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS_LONG= ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];

function daysInMonth(y, m) { return new Date(y, m+1, 0).getDate(); }
function firstDayOfMonth(y, m) { return new Date(y, m, 1).getDay(); }

// ── Week data ─────────────────────────────────────────────────
const WEEK_HOURS = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","13:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30"];

// ══════════════════════════════════════════════════════════════
export default function Calendrier() {
  const today  = new Date();
  const [year, setYear]   = useState(2026);
  const [month, setMonth] = useState(2); // March = 2
  const [viewMode, setViewMode] = useState("mois");
  const [selectedDay, setSelectedDay] = useState(3);
  const [weekStart, setWeekStart] = useState(1); // week starting monday March 1

  const totalDays  = daysInMonth(year, month);
  const firstDay   = firstDayOfMonth(year, month);

  // rdvs indexed by day
  const rdvByDay = useMemo(() => {
    const map = {};
    RDVS.forEach(r => { (map[r.day] = map[r.day]||[]).push(r); });
    Object.values(map).forEach(arr => arr.sort((a,b)=>a.time.localeCompare(b.time)));
    return map;
  }, []);

  const selectedDayRdvs = rdvByDay[selectedDay] || [];

  const prevMonth = () => { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const nextMonth = () => { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); };

  // Week days: weekStart = day-of-month for Sunday of the week
  const weekDays = Array.from({length:7},(_,i)=>weekStart+i);
  const prevWeek = () => setWeekStart(w => w-7);
  const nextWeek = () => setWeekStart(w => w+7);

  const isToday = (d) => d===26 && month===2 && year===2026;

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#f3f7f6", minHeight:"100vh", padding:"28px", display:"flex", flexDirection:"column", gap:0 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:24, fontWeight:800, color:"#16302b" }}>Calendrier des rendez-vous</div>
          <div style={{ fontSize:13, color:"#8aada8", marginTop:3 }}>{MONTHS_FR[month]} {year}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* Mois / Semaine toggle */}
          <div style={{ display:"flex", background:"#fff", borderRadius:12, padding:3, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
            {["mois","semaine"].map(v=>(
              <button key={v} onClick={()=>setViewMode(v)} style={{ padding:"7px 18px", borderRadius:10, border:"none", background:viewMode===v?G:"transparent", color:viewMode===v?"#fff":"#374040", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all 0.15s", textTransform:"capitalize" }}>
                {v.charAt(0).toUpperCase()+v.slice(1)}
              </button>
            ))}
          </div>
          {/* Nav */}
          <button onClick={viewMode==="mois"?prevMonth:prevWeek} style={{ width:34,height:34,borderRadius:10,border:"1px solid #dde8e6",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#374040" }}><ChevronLeft size={16}/></button>
          <span style={{ fontSize:15, fontWeight:700, color:"#16302b", minWidth:100, textAlign:"center" }}>{MONTHS_FR[month]} {year}</span>
          <button onClick={viewMode==="mois"?nextMonth:nextWeek} style={{ width:34,height:34,borderRadius:10,border:"1px solid #dde8e6",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#374040" }}><ChevronRight size={16}/></button>
        </div>
      </div>

      <div style={{ display:"flex", gap:18, alignItems:"flex-start" }}>
        {/* ── Main calendar ── */}
        <div style={{ flex:1, background:"#fff", borderRadius:18, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", overflow:"hidden" }}>

          {viewMode==="mois" ? (
            <>
              {/* Day headers */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:"1px solid #edf2f1" }}>
                {DAYS_FR.map(d=>(
                  <div key={d} style={{ padding:"12px 0", textAlign:"center", fontSize:11, fontWeight:700, color:"#8aada8", letterSpacing:"0.6px" }}>{d}</div>
                ))}
              </div>

              {/* Grid */}
              {(() => {
                const cells = [];
                for(let i=0;i<firstDay;i++) cells.push(null);
                for(let d=1;d<=totalDays;d++) cells.push(d);
                while(cells.length%7!==0) cells.push(null);
                const weeks = [];
                for(let i=0;i<cells.length;i+=7) weeks.push(cells.slice(i,i+7));
                return weeks.map((week,wi)=>(
                  <div key={wi} style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:wi<weeks.length-1?"1px solid #f0f4f2":"none" }}>
                    {week.map((day,di)=>{
                      const rdvs = day ? (rdvByDay[day]||[]) : [];
                      const shown = rdvs.slice(0,2);
                      const extra = rdvs.length-2;
                      const isSel = day===selectedDay;
                      const isT   = isToday(day);
                      return (
                        <div key={di} onClick={()=>day&&setSelectedDay(day)} style={{ minHeight:100, padding:"8px 8px 6px", borderRight:di<6?"1px solid #f0f4f2":"none", background:isSel?"#f0faf8":day?undefined:"#fafafa", cursor:day?"pointer":undefined, transition:"background 0.15s" }}
                          onMouseEnter={e=>{if(day&&!isSel) e.currentTarget.style.background="#f7fbfa";}}
                          onMouseLeave={e=>{if(day&&!isSel) e.currentTarget.style.background="transparent";}}>
                          {day&&(
                            <>
                              <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:4 }}>
                                <div style={{ width:26, height:26, borderRadius:"50%", background:isT?G:"transparent", color:isT?"#fff":"#374040", fontSize:13, fontWeight:isT?800:500, display:"flex", alignItems:"center", justifyContent:"center" }}>{day}</div>
                              </div>
                              <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                                {shown.map(r=>{
                                  const tc = TYPE_CFG[typeOf(r.type)]||TYPE_CFG.Consultation;
                                  return <div key={r.id} style={{ background:tc.bg, color:tc.color, borderRadius:7, padding:"3px 8px", fontSize:11, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", cursor:"pointer" }}>{r.time} {r.name}</div>;
                                })}
                                {extra>0&&<div style={{ fontSize:11, color:"#8aada8", fontWeight:600, paddingLeft:4 }}>+{extra} autre{extra>1?"s":""}</div>}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
            </>
          ) : (
            /* ── Week view ── */
            <>
              <div style={{ display:"grid", gridTemplateColumns:"60px repeat(7,1fr)", borderBottom:"1px solid #edf2f1" }}>
                <div/>
                {weekDays.map((d,i)=>{
                  const isT=isToday(d);
                  const valid=d>=1&&d<=totalDays;
                  return (
                    <div key={i} onClick={()=>valid&&setSelectedDay(d)} style={{ padding:"12px 0", textAlign:"center", cursor:valid?"pointer":undefined, background:d===selectedDay?G_LIGHT:"transparent", borderRight:i<6?"1px solid #f0f4f2":"none" }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"#8aada8", letterSpacing:"0.5px" }}>{DAYS_FR[i]}</div>
                      <div style={{ width:30, height:30, borderRadius:"50%", background:isT?G:"transparent", color:isT?"#fff":valid?"#374040":"#ccc", fontSize:14, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", margin:"4px auto 0" }}>{valid?d:""}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ maxHeight:480, overflowY:"auto" }}>
                {WEEK_HOURS.map(hour=>(
                  <div key={hour} style={{ display:"grid", gridTemplateColumns:"60px repeat(7,1fr)", minHeight:48, borderBottom:"1px solid #f5f8f7" }}>
                    <div style={{ padding:"4px 8px 0", fontSize:11, color:"#8aada8", fontWeight:600, borderRight:"1px solid #f0f4f2", textAlign:"right" }}>{hour}</div>
                    {weekDays.map((d,i)=>{
                      const rdvs=(rdvByDay[d]||[]).filter(r=>r.time===hour);
                      return (
                        <div key={i} style={{ borderRight:i<6?"1px solid #f0f4f2":"none", padding:"3px 4px", display:"flex", flexDirection:"column", gap:2 }}>
                          {rdvs.map(r=>{
                            const tc=TYPE_CFG[typeOf(r.type)]||TYPE_CFG.Consultation;
                            return <div key={r.id} style={{ background:tc.bg, color:tc.color, borderRadius:7, padding:"4px 8px", fontSize:11, fontWeight:700, cursor:"pointer" }}>{r.time} {r.name}</div>;
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div style={{ width:280, flexShrink:0, display:"flex", flexDirection:"column", gap:14 }}>

          {/* Legend */}
          <div style={{ background:"#fff", borderRadius:18, padding:"20px 22px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#16302b", marginBottom:14 }}>Légende</div>
            {[
              { label:"Consultation", key:"Consultation" },
              { label:"Bilan / Suivi",key:"Bilan"        },
              { label:"Radiologie",   key:"Radiologie"   },
              { label:"En attente",   key:"En attente"   },
              { label:"Spécialiste",  key:"Spécialiste"  },
            ].map(l=>{
              const c=TYPE_CFG[l.key];
              return (
                <div key={l.key} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:c.bg, flexShrink:0 }}/>
                  <span style={{ fontSize:13, color:"#374040" }}>{l.label}</span>
                </div>
              );
            })}
          </div>

          {/* Selected day detail */}
          <div style={{ background:"#fff", borderRadius:18, padding:"20px 22px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#16302b" }}>
              {DAYS_LONG[new Date(year,month,selectedDay).getDay()]} {String(selectedDay).padStart(2,"0")} {MONTHS_FR[month].toLowerCase()}
            </div>
            <div style={{ fontSize:12, color:"#8aada8", marginTop:2, marginBottom:16 }}>
              {selectedDayRdvs.length} rendez-vous
            </div>

            {selectedDayRdvs.length===0 && (
              <div style={{ fontSize:13, color:"#9ab0aa", textAlign:"center", padding:"16px 0" }}>Aucun rendez-vous</div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {selectedDayRdvs.map(r=>{
                const tc=TYPE_CFG[typeOf(r.type)]||TYPE_CFG.Consultation;
                return (
                  <div key={r.id} style={{ paddingBottom:14, borderBottom:"1px solid #f0f4f2" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:tc.bg, flexShrink:0 }}/>
                      <span style={{ fontSize:12, fontWeight:700, color:"#374040" }}>{r.time}</span>
                      <span style={{ fontSize:12, color:"#8aada8" }}>{r.type}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, paddingLeft:14 }}>
                      <User size={12} color="#8aada8"/>
                      <span style={{ fontSize:13, fontWeight:700, color:"#16302b" }}>{r.full}</span>
                    </div>
                    <div style={{ fontSize:12, color:"#8aada8", paddingLeft:14, marginTop:2 }}>{r.medecin}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Month stats */}
          <div style={{ background:`linear-gradient(135deg,${G},${G_DARK})`, borderRadius:18, padding:"22px", boxShadow:`0 4px 16px ${G}40` }}>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", marginBottom:6 }}>Ce mois-ci</div>
            <div style={{ fontSize:42, fontWeight:800, color:"#fff", lineHeight:1 }}>{RDVS.length}</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.8)", marginTop:6 }}>rendez-vous planifiés</div>
          </div>
        </div>
      </div>
    </div>
  );
}