import { useState, useMemo } from "react";
import {
  FileText, ArrowLeft, User, CreditCard,
  Eye, Download, Trash2, Search, Save,
  ChevronLeft, ChevronRight, CheckCircle2,
  Clock, TrendingUp, DollarSign, Banknote,
  Building2, Wallet, Printer, MapPin, Phone, Mail,
  Stethoscope,
} from "lucide-react";

const G       = "#2E8B7F";
const G_DARK  = "#1f6259";
const G_LIGHT = "#e8f5f3";
const G_MID   = "#5AADA3";
const PER_PAGE = 8;

const PATIENTS = ["Sophie Martin","Marc Leblanc","Claire Moreau","Pierre Garnier","Alice Fontaine","Thomas Rousseau","Emma Dubois","Lucas Bernard","Camille Petit","Julien Leroy"];
const CONSULTATION_TYPES = [
  { label:"Consultation générale", price:60  },
  { label:"Bilan sanguin",         price:45  },
  { label:"Suivi cardiologique",   price:90  },
  { label:"Vaccination",           price:35  },
  { label:"Radiologie",            price:120 },
  { label:"ECG",                   price:80  },
  { label:"Pédiatrie",             price:55  },
  { label:"Bilan complet",         price:150 },
];
const PAYMENT_MODES = [
  { label:"Carte bancaire",        icon: CreditCard },
  { label:"Espèces",               icon: Banknote   },
  { label:"Virement bancaire",     icon: Building2  },
  { label:"Mutuelle / Assurance",  icon: Wallet     },
  { label:"Chèque",                icon: FileText   },
];
const STATUS_CFG = {
  Payé:         { bg:G_LIGHT,   color:G,        dot:G         },
  "En attente": { bg:"#fff8e6", color:"#c47f00", dot:"#e0a020" },
  "En retard":  { bg:"#fff0f2", color:"#d93050", dot:"#d93050" },
};
const INITIAL_FACTURES = [
  { id:1,  num:"FAC-2026-001", patient:"Sophie Martin",   date:"01 mars 2026", consultation:"Consultation générale", montant:60,  ht:50,   tva:10,   paiement:"Carte bancaire",     statut:"Payé"        },
  { id:2,  num:"FAC-2026-002", patient:"Marc Leblanc",    date:"01 mars 2026", consultation:"Bilan sanguin",         montant:45,  ht:37.5, tva:7.5,  paiement:"Espèces",            statut:"Payé"        },
  { id:3,  num:"FAC-2026-003", patient:"Claire Moreau",   date:"02 mars 2026", consultation:"Suivi cardiologique",   montant:90,  ht:75,   tva:15,   paiement:"Virement bancaire",  statut:"En attente"  },
  { id:4,  num:"FAC-2026-004", patient:"Pierre Garnier",  date:"02 mars 2026", consultation:"Consultation générale", montant:60,  ht:50,   tva:10,   paiement:"Carte bancaire",     statut:"Payé"        },
  { id:5,  num:"FAC-2026-005", patient:"Alice Fontaine",  date:"02 mars 2026", consultation:"Vaccination",           montant:35,  ht:29.2, tva:5.8,  paiement:"Espèces",            statut:"Payé"        },
  { id:6,  num:"FAC-2026-006", patient:"Thomas Rousseau", date:"03 mars 2026", consultation:"Radio thorax",          montant:120, ht:100,  tva:20,   paiement:"Mutuelle / Assurance",statut:"En attente"  },
  { id:7,  num:"FAC-2026-007", patient:"Emma Dubois",     date:"03 mars 2026", consultation:"Consultation générale", montant:60,  ht:50,   tva:10,   paiement:"Carte bancaire",     statut:"En retard"   },
  { id:8,  num:"FAC-2026-008", patient:"Lucas Bernard",   date:"03 mars 2026", consultation:"ECG",                   montant:80,  ht:66.7, tva:13.3, paiement:"Virement bancaire",  statut:"Payé"        },
  { id:9,  num:"FAC-2026-009", patient:"Camille Petit",   date:"04 mars 2026", consultation:"Pédiatrie",             montant:55,  ht:45.8, tva:9.2,  paiement:"Espèces",            statut:"Payé"        },
  { id:10, num:"FAC-2026-010", patient:"Julien Leroy",    date:"04 mars 2026", consultation:"Bilan complet",         montant:150, ht:125,  tva:25,   paiement:"Mutuelle / Assurance",statut:"En attente"  },
  { id:11, num:"FAC-2026-011", patient:"Sophie Martin",   date:"05 mars 2026", consultation:"Suivi cardiologique",   montant:90,  ht:75,   tva:15,   paiement:"Virement bancaire",  statut:"Payé"        },
  { id:12, num:"FAC-2026-012", patient:"Marc Leblanc",    date:"06 mars 2026", consultation:"Consultation générale", montant:60,  ht:50,   tva:10,   paiement:"Carte bancaire",     statut:"En retard"   },
];

const initials  = name => name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const truncate  = (str, n=18) => str.length > n ? str.slice(0, n) + "…" : str;
let facCounter  = 13;
const nextNum   = () => { const n = `FAC-2026-${String(facCounter).padStart(3,"0")}`; facCounter++; return n; };

// ══════════════════════════════════════════════════════════════
// PDF GENERATOR — builds an HTML string then opens print dialog
// ══════════════════════════════════════════════════════════════
const generatePDF = (facture) => {
  const ini = initials(facture.patient);
  const statusColor = facture.statut==="Payé" ? G : facture.statut==="En attente" ? "#c47f00" : "#d93050";

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>${facture.num}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:#f3f7f6;display:flex;justify-content:center;padding:40px 20px;}
  .page{background:#fff;width:720px;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1);}
  .header{background:linear-gradient(135deg,${G},${G_DARK});padding:28px 32px;display:flex;justify-content:space-between;align-items:flex-start;}
  .logo-box{width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;}
  .cabinet-name{color:#fff;font-size:20px;font-weight:800;margin-bottom:2px;}
  .cabinet-sub{color:rgba(255,255,255,0.75);font-size:13px;margin-bottom:12px;}
  .cabinet-info{color:rgba(255,255,255,0.8);font-size:12px;line-height:1.9;}
  .fac-num{color:#fff;font-size:22px;font-weight:800;text-align:right;}
  .fac-date{color:rgba(255,255,255,0.75);font-size:13px;text-align:right;margin-top:2px;margin-bottom:14px;}
  .amount-box{background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 18px;text-align:right;}
  .amount-label{color:rgba(255,255,255,0.7);font-size:11px;margin-bottom:3px;}
  .amount-val{color:#fff;font-size:26px;font-weight:800;}
  .body{padding:28px 32px;}
  .two-col{display:flex;gap:32px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #edf2f1;}
  .col-label{font-size:10px;font-weight:700;color:#8aada8;letter-spacing:0.7px;text-transform:uppercase;margin-bottom:10px;}
  .avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,${G},${G_MID});color:#fff;font-weight:800;font-size:14px;display:flex;align-items:center;justify-content:center;margin-right:10px;flex-shrink:0;}
  .patient-name{font-weight:700;font-size:16px;color:#16302b;}
  .patient-sub{font-size:12px;color:#8aada8;margin-top:2px;}
  .pay-row{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;color:#374040;}
  table{width:100%;border-collapse:collapse;margin-bottom:20px;}
  th{font-size:10px;font-weight:700;color:#8aada8;letter-spacing:0.7px;text-transform:uppercase;padding:8px 0;text-align:left;border-bottom:2px solid #edf2f1;}
  th:not(:first-child){text-align:right;}
  td{padding:14px 0;font-size:14px;color:#374040;border-bottom:1px solid #f5f8f7;vertical-align:top;}
  td:not(:first-child){text-align:right;}
  .desc-title{font-weight:700;font-size:14px;color:#16302b;margin-bottom:2px;}
  .desc-sub{font-size:12px;color:#8aada8;}
  .totals{margin-left:auto;width:260px;}
  .total-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#374040;}
  .total-final{display:flex;justify-content:space-between;padding:12px 0 6px;font-size:16px;font-weight:800;color:#16302b;border-top:2px solid #edf2f1;margin-top:4px;}
  .total-final-val{color:${G};}
  .footer{display:flex;justify-content:space-between;align-items:center;padding:16px 32px;border-top:1px solid #edf2f1;background:#fafcfb;}
  .official{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:${G};}
  .siret{font-size:11px;color:#8aada8;}
  .status-badge{display:inline-flex;align-items:center;gap:5px;background:${STATUS_CFG[facture.statut]?.bg||G_LIGHT};color:${statusColor};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;}
  .dot{width:6px;height:6px;border-radius:50%;background:${statusColor};display:inline-block;}
  @media print{body{background:#fff;padding:0;}  .page{box-shadow:none;border-radius:0;width:100%;}}
</style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div>
      <div class="logo-box">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
      </div>
      <div class="cabinet-name">Cabinet Médical</div>
      <div class="cabinet-sub">Dr. Jean Martin</div>
      <div class="cabinet-info">
        📍 12 Rue de la Santé, 75013 Paris<br/>
        📞 +33 1 23 45 67 89<br/>
        ✉ contact@cabinet-medical.fr
      </div>
    </div>
    <div>
      <div style="font-size:10px;color:rgba(255,255,255,0.6);letter-spacing:1px;text-align:right;margin-bottom:4px;">FACTURE</div>
      <div class="fac-num">${facture.num}</div>
      <div class="fac-date">${facture.date}</div>
      <div class="amount-box">
        <div class="amount-label">Montant total</div>
        <div class="amount-val">${facture.montant.toFixed(2)} MAD</div>
      </div>
    </div>
  </div>

  <!-- Body -->
  <div class="body">
    <!-- Patient + Payment -->
    <div class="two-col">
      <div style="flex:1">
        <div class="col-label">Patient</div>
        <div style="display:flex;align-items:center;">
          <div class="avatar">${ini}</div>
          <div>
            <div class="patient-name">${facture.patient}</div>
            <div class="patient-sub">Patient référencé</div>
          </div>
        </div>
      </div>
      <div style="flex:1">
        <div class="col-label">Mode de paiement</div>
        <div class="pay-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${G}" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          ${facture.paiement}
        </div>
        <div style="margin-top:10px;">
          <span class="status-badge"><span class="dot"></span>${facture.statut}</span>
        </div>
      </div>
    </div>

    <!-- Line items -->
    <table>
      <thead>
        <tr>
          <th style="width:50%">Description</th>
          <th>Prix HT</th>
          <th>TVA (20%)</th>
          <th>Total TTC</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="desc-title">${facture.consultation}</div>
            <div class="desc-sub">Dr. Jean Martin · ${facture.date}</div>
          </td>
          <td>${(facture.ht||facture.montant/1.2).toFixed(2)} MAD</td>
          <td>${(facture.tva||facture.montant-facture.montant/1.2).toFixed(2)} MAD</td>
          <td style="font-weight:700;color:#16302b;">${facture.montant.toFixed(2)} MAD</td>
        </tr>
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="total-row"><span>Sous-total HT</span><span>${(facture.ht||facture.montant/1.2).toFixed(2)} MAD</span></div>
      <div class="total-row"><span>TVA (20%)</span><span>${(facture.tva||facture.montant-facture.montant/1.2).toFixed(2)} MAD</span></div>
      <div class="total-final"><span>Total TTC</span><span class="total-final-val">${facture.montant.toFixed(2)} MAD</span></div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="official">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${G}" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Facture officielle
    </div>
    <div class="siret">SIRET: 123 456 789 00012 · N° RPPS: 10012345678</div>
  </div>
</div>
<script>window.onload=()=>window.print();</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `${facture.num}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Shared UI ─────────────────────────────────────────────────
const Toast = ({ msg }) => (
  <div style={{ position:"fixed",bottom:28,right:28,zIndex:999,background:"#16302b",color:"#fff",borderRadius:14,padding:"12px 20px",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:8,boxShadow:"0 8px 30px rgba(0,0,0,0.18)" }}>
    <CheckCircle2 size={16} color={G_MID}/> {msg}
  </div>
);

const StatusBadge = ({ statut }) => {
  const s = STATUS_CFG[statut] || STATUS_CFG["Payé"];
  return (
    <span style={{ display:"inline-flex",alignItems:"center",gap:5,background:s.bg,color:s.color,padding:"4px 11px",borderRadius:20,fontSize:12,fontWeight:700,whiteSpace:"nowrap" }}>
      <span style={{ width:6,height:6,borderRadius:"50%",background:s.dot,flexShrink:0 }}/>{statut}
    </span>
  );
};

const ActBtn = ({ onClick, color, hoverBg, children, title }) => {
  const [h,setH]=useState(false);
  return <button title={title} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ background:h?hoverBg:"transparent",border:"none",borderRadius:8,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",color,cursor:"pointer",transition:"all 0.15s" }}>{children}</button>;
};

const PageBtn = ({ onClick, disabled, active, children }) => (
  <button onClick={onClick} disabled={disabled} style={{ width:34,height:34,borderRadius:10,border:"1px solid",borderColor:active?G:"#dde8e6",background:active?G:"#fff",color:active?"#fff":disabled?"#ccc":"#374040",fontWeight:700,fontSize:13,cursor:disabled?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s" }}>{children}</button>
);

const StatCard = ({ icon:Icon, iconBg, iconColor, label, value, valueColor }) => (
  <div style={{ flex:"1 1 200px",background:"#fff",borderRadius:18,padding:"20px 24px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",gap:16 }}>
    <div style={{ background:iconBg,borderRadius:12,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
      <Icon size={20} color={iconColor} strokeWidth={2}/>
    </div>
    <div>
      <div style={{ fontSize:12,color:"#8aada8",fontWeight:500,marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:24,fontWeight:800,color:valueColor||"#16302b",letterSpacing:"-0.5px" }}>{value}</div>
    </div>
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

// ══════════════════════════════════════════════════════════════
// INVOICE PREVIEW — shown before download
// ══════════════════════════════════════════════════════════════
function InvoicePreview({ facture, onBack, onDownload }) {
  const ini = initials(facture.patient);
  const ht  = facture.ht  || +(facture.montant/1.2).toFixed(2);
  const tva = facture.tva || +(facture.montant - ht).toFixed(2);
  const statusColor = facture.statut==="Payé" ? G : facture.statut==="En attente" ? "#c47f00" : "#d93050";

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif",background:"#f3f7f6",minHeight:"100vh",padding:"24px 28px 48px" }}>
      {/* Toolbar */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <button onClick={onBack} style={{ background:"none",border:"none",cursor:"pointer",color:"#374040",padding:6,borderRadius:8 }}><ArrowLeft size={20}/></button>
          <div>
            <div style={{ fontSize:20,fontWeight:800,color:"#16302b" }}>Facture générée</div>
            <div style={{ fontSize:13,color:"#8aada8",marginTop:1 }}>{facture.num}</div>
          </div>
        </div>
        <div style={{ display:"flex",gap:10 }}>
          <button onClick={()=>generatePDF(facture)} style={{ display:"flex",alignItems:"center",gap:7,padding:"10px 18px",borderRadius:12,border:"1px solid #dde8e6",background:"#fff",color:"#374040",fontSize:13,fontWeight:600,cursor:"pointer" }}>
            <Printer size={15}/> Imprimer
          </button>
          <button onClick={onDownload} style={{ display:"flex",alignItems:"center",gap:7,padding:"10px 20px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${G},${G_DARK})`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 14px ${G}45` }}>
            <Download size={15}/> Exporter PDF
          </button>
        </div>
      </div>

      {/* Invoice card */}
      <div style={{ maxWidth:720,margin:"0 auto",background:"#fff",borderRadius:18,overflow:"hidden",boxShadow:"0 4px 24px rgba(0,0,0,0.08)" }}>
        {/* Green header */}
        <div style={{ background:`linear-gradient(135deg,${G},${G_DARK})`,padding:"28px 32px",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
          <div>
            <div style={{ width:44,height:44,background:"rgba(255,255,255,0.2)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10 }}>
              <Stethoscope size={22} color="#fff"/>
            </div>
            <div style={{ fontSize:20,fontWeight:800,color:"#fff",marginBottom:2 }}>Cabinet Médical</div>
            <div style={{ fontSize:13,color:"rgba(255,255,255,0.75)",marginBottom:14 }}>Dr. Jean Martin</div>
            <div style={{ fontSize:12,color:"rgba(255,255,255,0.75)",lineHeight:1.9 }}>
              <div style={{ display:"flex",alignItems:"center",gap:6 }}><MapPin size={12}/>12 Rue de la Santé, 75013 Paris</div>
              <div style={{ display:"flex",alignItems:"center",gap:6 }}><Phone size={12}/>+33 1 23 45 67 89</div>
              <div style={{ display:"flex",alignItems:"center",gap:6 }}><Mail size={12}/>contact@cabinet-medical.fr</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10,color:"rgba(255,255,255,0.6)",letterSpacing:"1px",marginBottom:4 }}>FACTURE</div>
            <div style={{ fontSize:22,fontWeight:800,color:"#fff" }}>{facture.num}</div>
            <div style={{ fontSize:13,color:"rgba(255,255,255,0.75)",marginTop:2,marginBottom:14 }}>{facture.date}</div>
            <div style={{ background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"12px 18px",textAlign:"right" }}>
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.7)",marginBottom:3 }}>Montant total</div>
              <div style={{ fontSize:26,fontWeight:800,color:"#fff" }}>{facture.montant.toFixed(2)} MAD</div>
            </div>
          </div>
        </div>

        {/* Patient + payment */}
        <div style={{ padding:"24px 32px",display:"flex",gap:40,borderBottom:"1px solid #edf2f1" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10,fontWeight:700,color:"#8aada8",letterSpacing:"0.7px",marginBottom:10 }}>PATIENT</div>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${G},${G_MID})`,color:"#fff",fontWeight:800,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{ini}</div>
              <div>
                <div style={{ fontWeight:700,fontSize:16,color:"#16302b" }}>{facture.patient}</div>
                <div style={{ fontSize:12,color:"#8aada8",marginTop:2 }}>Patient référencé</div>
              </div>
            </div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10,fontWeight:700,color:"#8aada8",letterSpacing:"0.7px",marginBottom:10 }}>MODE DE PAIEMENT</div>
            <div style={{ display:"flex",alignItems:"center",gap:8,fontSize:15,fontWeight:600,color:"#374040" }}>
              <CreditCard size={16} color={G}/>{facture.paiement}
            </div>
            <div style={{ marginTop:10 }}>
              <span style={{ display:"inline-flex",alignItems:"center",gap:5,background:STATUS_CFG[facture.statut]?.bg||G_LIGHT,color:statusColor,padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:700 }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:statusColor,display:"inline-block" }}/>{facture.statut}
              </span>
            </div>
          </div>
        </div>

        {/* Line items table */}
        <div style={{ padding:"24px 32px" }}>
          <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",padding:"8px 0",borderBottom:"2px solid #edf2f1",marginBottom:4 }}>
            {["DESCRIPTION","PRIX HT","TVA (20%)","TOTAL TTC"].map((h,i)=>(
              <div key={h} style={{ fontSize:10,fontWeight:700,color:"#8aada8",letterSpacing:"0.7px",textAlign:i>0?"right":"left" }}>{h}</div>
            ))}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",padding:"16px 0",borderBottom:"1px solid #f0f4f2",alignItems:"start" }}>
            <div>
              <div style={{ fontWeight:700,fontSize:15,color:"#16302b",marginBottom:3 }}>{facture.consultation}</div>
              <div style={{ fontSize:12,color:"#8aada8" }}>Dr. Jean Martin · {facture.date}</div>
            </div>
            <div style={{ textAlign:"right",fontSize:14,color:"#374040" }}>{ht.toFixed(2)} MAD</div>
            <div style={{ textAlign:"right",fontSize:14,color:"#374040" }}>{tva.toFixed(2)} MAD</div>
            <div style={{ textAlign:"right",fontSize:14,fontWeight:700,color:"#16302b" }}>{facture.montant.toFixed(2)} MAD</div>
          </div>

          {/* Totals */}
          <div style={{ display:"flex",justifyContent:"flex-end",marginTop:16 }}>
            <div style={{ width:260 }}>
              <div style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:13,color:"#374040" }}>
                <span>Sous-total HT</span><span>{ht.toFixed(2)} MAD</span>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:13,color:"#374040",borderBottom:"1px solid #edf2f1" }}>
                <span>TVA (20%)</span><span>{tva.toFixed(2)} MAD</span>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",padding:"14px 0 6px",fontSize:16,fontWeight:800 }}>
                <span style={{ color:"#16302b" }}>Total TTC</span>
                <span style={{ color:G,fontSize:20 }}>{facture.montant.toFixed(2)} MAD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 32px",background:"#fafcfb",borderTop:"1px solid #edf2f1" }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,color:G }}>
            <CheckCircle2 size={15}/> Facture officielle
          </div>
          <div style={{ fontSize:11,color:"#8aada8" }}>SIRET: 123 456 789 00012 · N° RPPS: 10012345678</div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// GENERATE FORM
// ══════════════════════════════════════════════════════════════
function GenerateForm({ onBack, onGenerated }) {
  const [patient,   setPatient]  = useState("");
  const [consult,   setConsult]  = useState(null);
  const [customAmt, setCustomAmt]= useState("");
  const [remise,    setRemise]   = useState("0");
  const [paiement,  setPaiement] = useState("Carte bancaire");
  const [notes,     setNotes]    = useState("");
  const [patOpen,   setPatOpen]  = useState(false);

  const basePrice = consult ? consult.price : (parseFloat(customAmt)||0);
  const remisePct = Math.min(100,Math.max(0,parseFloat(remise)||0));
  const ht        = +(basePrice*(1-remisePct/100)).toFixed(2);
  const tva       = +(ht*0.20).toFixed(2);
  const ttc       = +(ht+tva).toFixed(2);
  const canGen    = patient && (consult || parseFloat(customAmt)>0);

  const handleGenerate = () => {
    if (!canGen) return;
    const f = {
      id:           Date.now(),
      num:          nextNum(),
      patient,
      date:         new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}),
      consultation: consult ? consult.label : "Consultation personnalisée",
      montant:      ttc,
      ht, tva,
      paiement,
      statut:       "En attente",
      notes,
    };
    onGenerated(f);
  };

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif",background:"#f3f7f6",minHeight:"100vh",padding:"24px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:24 }}>
        <button onClick={onBack} style={{ background:"none",border:"none",cursor:"pointer",color:"#374040",padding:6,borderRadius:8 }}><ArrowLeft size={20}/></button>
        <div>
          <div style={{ fontSize:22,fontWeight:800,color:"#16302b" }}>Générer une facture</div>
          <div style={{ fontSize:13,color:"#8aada8",marginTop:1 }}>Créez une nouvelle facture médicale</div>
        </div>
      </div>

      <div style={{ display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 560px" }}>
          <Section icon={User} title="Informations de facturation">
            <label style={{ fontSize:13,fontWeight:600,color:"#374040",display:"block",marginBottom:6 }}>Patient <span style={{color:"#e03150"}}>*</span></label>
            <div style={{ position:"relative",marginBottom:20 }}>
              <div onClick={()=>setPatOpen(o=>!o)} style={{ display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderRadius:12,border:`1px solid ${patOpen?G:"#e0eae8"}`,background:"#f8fbfa",cursor:"pointer" }}>
                <User size={15} color="#9ab0aa"/>
                <span style={{ fontSize:14,color:patient?"#16302b":"#9ab0aa",flex:1 }}>{patient||"Sélectionner un patient"}</span>
              </div>
              {patOpen && (
                <div style={{ position:"absolute",left:0,right:0,top:"calc(100% + 4px)",background:"#fff",borderRadius:14,boxShadow:"0 8px 28px rgba(0,0,0,0.12)",zIndex:50,border:"1px solid #edf2f1",overflow:"hidden" }}>
                  {PATIENTS.map(p=>(
                    <div key={p} onClick={()=>{setPatient(p);setPatOpen(false);}}
                      style={{ padding:"11px 16px",fontSize:14,fontWeight:p===patient?700:500,color:p===patient?G:"#374040",background:p===patient?G_LIGHT:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:10 }}
                      onMouseEnter={e=>{if(p!==patient)e.currentTarget.style.background="#f5f8f7";}} onMouseLeave={e=>{if(p!==patient)e.currentTarget.style.background="#fff";}}>
                      <div style={{ width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${G},${G_MID})`,color:"#fff",fontWeight:800,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{initials(p)}</div>
                      {p}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <label style={{ fontSize:13,fontWeight:600,color:"#374040",display:"block",marginBottom:10 }}>Type de consultation <span style={{color:"#e03150"}}>*</span></label>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
              {CONSULTATION_TYPES.map(t=>{
                const sel = consult?.label===t.label;
                return (
                  <button key={t.label} onClick={()=>setConsult(sel?null:t)} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderRadius:12,border:`1px solid ${sel?G:"#e0eae8"}`,background:sel?G_LIGHT:"#f8fbfa",cursor:"pointer",transition:"all 0.15s" }}>
                    <span style={{ fontSize:13,fontWeight:sel?700:500,color:sel?G:"#374040" }}>{t.label}</span>
                    <span style={{ fontSize:13,fontWeight:700,color:sel?G:"#374040" }}>{t.price} MAD</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                <label style={{ fontSize:13,fontWeight:600,color:"#374040" }}>Montant personnalisé (MAD)</label>
                <div style={{ position:"relative" }}>
                  <DollarSign size={14} color="#9ab0aa" style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)" }}/>
                  <input type="number" placeholder="0.00" value={customAmt} onChange={e=>{setCustomAmt(e.target.value);setConsult(null);}}
                    style={{ width:"100%",boxSizing:"border-box",padding:"10px 14px 10px 32px",borderRadius:10,border:"1px solid #e0eae8",background:"#f8fbfa",fontSize:14,color:"#16302b",outline:"none",fontFamily:"inherit" }}
                    onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor="#e0eae8"}/>
                </div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                <label style={{ fontSize:13,fontWeight:600,color:"#374040" }}>Remise (%)</label>
                <input type="number" min="0" max="100" value={remise} onChange={e=>setRemise(e.target.value)}
                  style={{ padding:"10px 14px",borderRadius:10,border:"1px solid #e0eae8",background:"#f8fbfa",fontSize:14,color:"#16302b",outline:"none",fontFamily:"inherit" }}
                  onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor="#e0eae8"}/>
              </div>
            </div>
          </Section>

          <Section icon={CreditCard} iconBg="#eef0ff" iconColor="#4f6ef7" title="Mode de paiement">
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
              {PAYMENT_MODES.map(m=>{
                const sel = paiement===m.label;
                return (
                  <button key={m.label} onClick={()=>setPaiement(m.label)} style={{ display:"flex",alignItems:"center",gap:8,padding:"12px 14px",borderRadius:12,border:`1px solid ${sel?G:"#e0eae8"}`,background:sel?G_LIGHT:"#f8fbfa",cursor:"pointer",transition:"all 0.15s" }}>
                    <m.icon size={15} color={sel?G:"#9ab0aa"}/>
                    <span style={{ fontSize:13,fontWeight:sel?700:500,color:sel?G:"#374040" }}>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section icon={FileText} title="Notes (optionnel)">
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Informations complémentaires sur la facture..." rows={4}
              style={{ width:"100%",boxSizing:"border-box",padding:"12px 14px",borderRadius:12,border:"1px solid #e0eae8",background:"#f8fbfa",fontSize:14,color:"#16302b",resize:"vertical",outline:"none",fontFamily:"inherit" }}
              onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor="#e0eae8"}/>
          </Section>
        </div>

        {/* Recap */}
        <div style={{ width:300,flexShrink:0,display:"flex",flexDirection:"column",gap:14 }}>
          <div style={{ background:"#fff",borderRadius:18,padding:"22px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize:16,fontWeight:700,color:"#16302b",marginBottom:18 }}>Récapitulatif</div>
            {[
              { label:"Patient",      value:patient||"—" },
              { label:"Consultation", value:consult?truncate(consult.label,22):(parseFloat(customAmt)>0?"Personnalisé":"—") },
              { label:"Paiement",     value:paiement },
            ].map(r=>(
              <div key={r.label} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f0f4f2" }}>
                <span style={{ fontSize:13,color:"#8aada8" }}>{r.label}</span>
                <span style={{ fontSize:13,fontWeight:600,color:"#374040",textAlign:"right" }}>{r.value}</span>
              </div>
            ))}
            <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f0f4f2" }}>
              <span style={{ fontSize:13,color:"#8aada8" }}>Montant HT</span>
              <span style={{ fontSize:13,fontWeight:600,color:"#374040" }}>{ht.toFixed(2)} MAD</span>
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #edf2f1" }}>
              <span style={{ fontSize:13,color:"#8aada8" }}>TVA (20%)</span>
              <span style={{ fontSize:13,fontWeight:600,color:"#374040" }}>{tva.toFixed(2)} MAD</span>
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",padding:"14px 0 6px" }}>
              <span style={{ fontSize:15,fontWeight:700,color:"#16302b" }}>Total TTC</span>
              <span style={{ fontSize:22,fontWeight:800,color:canGen?G:"#ccc" }}>{ttc.toFixed(2)} MAD</span>
            </div>
          </div>

          <div style={{ background:G_LIGHT,borderRadius:18,padding:"18px 20px",border:`1px solid ${G}22` }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
              <Building2 size={15} color={G}/>
              <span style={{ fontSize:14,fontWeight:700,color:G }}>Cabinet Médical</span>
            </div>
            <div style={{ fontSize:13,color:"#374040",lineHeight:1.7 }}>
              Dr. Jean Martin<br/>
              12 Rue de la Santé, 75013 Paris<br/>
              <span style={{ color:"#8aada8" }}>SIRET: 123 456 789 00012</span>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!canGen}
            style={{ background:canGen?`linear-gradient(135deg,${G},${G_DARK})`:"#c8d8d5",border:"none",borderRadius:14,padding:"14px",color:"#fff",fontWeight:700,fontSize:15,cursor:canGen?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:canGen?`0 4px 16px ${G}50`:"none",transition:"all 0.2s" }}>
            <Save size={16}/> Générer la facture
          </button>
          <button onClick={onBack} style={{ background:"none",border:"none",color:"#8aada8",fontSize:14,fontWeight:600,cursor:"pointer",padding:"6px" }}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// LIST
// ══════════════════════════════════════════════════════════════
function FacturationList({ factures, onNew, onDelete, onDownload }) {
  const [search,   setSearch]  = useState("");
  const [medFilter,setMedFilter]=useState("Tous");
  const [statTab,  setStatTab] = useState("Tous");
  const [page,     setPage]    = useState(1);
  const TABS=["Tous","Payé","En attente","En retard"];
  const MEDS=["Tous","Dr. Dupont","Dr. Bernard","Dr. Petit","Dr. Martin"];

  const filtered = useMemo(()=>factures.filter(f=>{
    const matchTab    = statTab==="Tous"||f.statut===statTab;
    const matchSearch = `${f.patient} ${f.num}`.toLowerCase().includes(search.toLowerCase());
    return matchTab&&matchSearch;
  }),[factures,statTab,search]);

  const totalPages = Math.ceil(filtered.length/PER_PAGE);
  const slice = filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);

  const revenusPercus = factures.filter(f=>f.statut==="Payé").reduce((s,f)=>s+f.montant,0);
  const enAttente     = factures.filter(f=>f.statut==="En attente").reduce((s,f)=>s+f.montant,0);
  const enRetard      = factures.filter(f=>f.statut==="En retard").reduce((s,f)=>s+f.montant,0);

  const COLS=[{label:"N° FACTURE",w:"13%"},{label:"PATIENT",w:"22%"},{label:"DATE",w:"10%"},{label:"CONSULTATION",w:"18%"},{label:"MONTANT",w:"9%"},{label:"PAIEMENT",w:"13%"},{label:"STATUT",w:"10%"},{label:"ACTIONS",w:"5%",right:true}];

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif",background:"#f3f7f6",minHeight:"100vh",padding:"28px 28px 48px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24 }}>
        <div>
          <div style={{ fontSize:24,fontWeight:800,color:"#16302b" }}>Facturation</div>
          <div style={{ fontSize:13,color:"#8aada8",marginTop:3 }}>{factures.length} factures trouvées</div>
        </div>
        <button onClick={onNew} style={{ background:`linear-gradient(135deg,${G},${G_DARK})`,border:"none",borderRadius:14,padding:"12px 22px",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:`0 4px 16px ${G}50` }}>
          <FileText size={16}/> Générer une facture
        </button>
      </div>
      <div style={{ display:"flex",gap:16,marginBottom:20,flexWrap:"wrap" }}>
        <StatCard icon={CheckCircle2} iconBg={G_LIGHT}  iconColor={G}       label="Revenus perçus" value={`${revenusPercus} MAD`} valueColor={G}/>
        <StatCard icon={Clock}        iconBg="#fff8e6"  iconColor="#e0a020" label="En attente"     value={`${enAttente} MAD`}     valueColor="#c47f00"/>
        <StatCard icon={TrendingUp}   iconBg="#fff0f2"  iconColor="#d93050" label="En retard"      value={`${enRetard} MAD`}      valueColor="#d93050"/>
      </div>
      <div style={{ background:"#fff",borderRadius:16,padding:"10px 16px",display:"flex",alignItems:"center",gap:12,marginBottom:20,boxShadow:"0 1px 6px rgba(0,0,0,0.06)",flexWrap:"wrap" }}>
        <Search size={16} color="#9ab0aa"/>
        <input placeholder="Rechercher par patient ou N° facture..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
          style={{ flex:1,minWidth:200,border:"none",outline:"none",fontSize:14,color:"#16302b",background:"transparent",fontFamily:"inherit" }}/>
        <select value={medFilter} onChange={e=>setMedFilter(e.target.value)} style={{ border:"1px solid #dde8e6",borderRadius:10,padding:"6px 12px",fontSize:13,color:"#374040",background:"#f8fbfa",outline:"none",fontFamily:"inherit" }}>
          {MEDS.map(m=><option key={m}>{m}</option>)}
        </select>
        <div style={{ display:"flex",gap:4 }}>
          {TABS.map(t=>{const a=statTab===t;return<button key={t} onClick={()=>{setStatTab(t);setPage(1);}} style={{ padding:"6px 14px",borderRadius:20,border:"1px solid",borderColor:a?G:"transparent",background:a?G:"transparent",color:a?"#fff":"#374040",fontWeight:a?700:500,fontSize:13,cursor:"pointer",transition:"all 0.15s" }}>{t}</button>;})}
        </div>
      </div>
      <div style={{ background:"#fff",borderRadius:18,boxShadow:"0 1px 6px rgba(0,0,0,0.06)",overflow:"hidden" }}>
        <div style={{ display:"flex",padding:"12px 20px",borderBottom:"1px solid #edf2f1" }}>
          {COLS.map(c=><div key={c.label} style={{ width:c.w,fontSize:11,fontWeight:700,color:"#8aada8",letterSpacing:"0.6px",textAlign:c.right?"right":"left" }}>{c.label}</div>)}
        </div>
        {slice.length===0&&<div style={{ padding:"40px",textAlign:"center",color:"#9ab0aa" }}>Aucune facture trouvée</div>}
        {slice.map((f,i)=>(
          <FactureRow key={f.id} facture={f} odd={i%2===0}
            onDelete={()=>onDelete(f.id)}
            onDownload={()=>onDownload(f)}
          />
        ))}
      </div>
      {totalPages>1&&(
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:20 }}>
          <div style={{ fontSize:13,color:"#8aada8" }}>{(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)} sur {filtered.length}</div>
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

function FactureRow({ facture:f, odd, onDelete, onDownload }) {
  const [hov,setHov]=useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"flex",alignItems:"center",padding:"13px 20px",background:hov?G_LIGHT:odd?"#fafcfb":"#fff",borderBottom:"1px solid #f0f4f2",transition:"background 0.15s" }}>
      <div style={{ width:"13%" }}><span style={{ background:"#f3f7f6",color:"#374040",borderRadius:8,padding:"3px 10px",fontSize:12,fontWeight:600,fontFamily:"monospace" }}>{f.num}</span></div>
      <div style={{ width:"22%",display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${G},${G_MID})`,color:"#fff",fontWeight:800,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{initials(f.patient)}</div>
        <span style={{ fontWeight:700,fontSize:14,color:"#16302b" }}>{f.patient}</span>
      </div>
      <div style={{ width:"10%",fontSize:14,color:"#374040" }}>{f.date?.replace(" 2026","")}</div>
      <div style={{ width:"18%",fontSize:14,color:"#374040" }}>{truncate(f.consultation,20)}</div>
      <div style={{ width:"9%",fontSize:15,fontWeight:800,color:"#16302b" }}>{f.montant} MAD</div>
      <div style={{ width:"13%" }}><span style={{ background:"#f3f7f6",color:"#374040",borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:500 }}>{truncate(f.paiement,14)}</span></div>
      <div style={{ width:"10%" }}><StatusBadge statut={f.statut}/></div>
      <div style={{ width:"5%",display:"flex",justifyContent:"flex-end",gap:2 }}>
        <ActBtn onClick={onDownload} color="#4f6ef7" hoverBg="#eef0ff" title="Télécharger"><Download size={14}/></ActBtn>
        <ActBtn onClick={onDelete}  color="#e03150" hoverBg="#fff0f2" title="Supprimer"><Trash2 size={14}/></ActBtn>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════
export default function Facturation() {
  const [factures, setFactures]   = useState(INITIAL_FACTURES);
  const [view,     setView]       = useState("list"); // list | form | preview
  const [preview,  setPreview]    = useState(null);
  const [toast,    setToast]      = useState("");

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""),3000); };

  // Called from form — show preview + add to list
  const handleGenerated = f => {
    setFactures(fs => [f, ...fs]);
    setPreview(f);
    setView("preview");
    showToast("Facture générée !");
  };

  // Called from preview toolbar or list download button
  const handleDownload = f => {
    generatePDF(f);
    showToast(`Téléchargement de ${f.num}…`);
  };

  const handleDelete = id => {
    setFactures(fs => fs.filter(f=>f.id!==id));
    showToast("Facture supprimée");
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {view==="list" && (
        <FacturationList
          factures={factures}
          onNew={()=>setView("form")}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      )}
      {view==="form" && (
        <GenerateForm
          onBack={()=>setView("list")}
          onGenerated={handleGenerated}
        />
      )}
      {view==="preview" && preview && (
        <InvoicePreview
          facture={preview}
          onBack={()=>setView("list")}
          onDownload={()=>handleDownload(preview)}
        />
      )}

      {toast && <Toast msg={toast}/>}
    </>
  );
}