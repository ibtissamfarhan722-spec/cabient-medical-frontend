import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Car, Calendar, FileText, 
  Plus, X, History, LogOut, Trash2, User, MapPin, 
  Phone, Mail, Lock, Wrench, Clock, CheckCircle, 
  Loader2, AlertCircle, Download, Check, Ban
} from 'lucide-react';

import Logo from '../assets/images/Logo.png';

const API_BASE_URL = "http://127.0.0.1:8000/api";

const EspaceAdmin = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // --- DONNÉES ---
  const [dashboard, setDashboard] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [devis, setDevis] = useState([]);
  const [factures, setFactures] = useState([]);

  // --- FORMULAIRES ---
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showApptForm, setShowApptForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ marque: '', modele: '', immatriculation: '', kilometrage_actuel: '' });
  const [newAppt, setNewAppt] = useState({ date: '', heure: '', motif: '', vehicule_id: '' });

  useEffect(() => {
    if (user) fetchInitialData();
  }, [user]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [resDash, resVehicles, resAppts, resDevis, resFactures] = await Promise.all([
        axios.get(`${API_BASE_URL}/client/${user.id}/dashboard`),
        axios.get(`${API_BASE_URL}/client/${user.id}/vehicules`),
        axios.get(`${API_BASE_URL}/client/${user.id}/rendez-vous`),
        axios.get(`${API_BASE_URL}/client/${user.id}/devis`),
        axios.get(`${API_BASE_URL}/client/${user.id}/factures`)
      ]);

      setDashboard(resDash.data);
      setVehicles(resVehicles.data);
      setAppointments(resAppts.data);
      setDevis(resDevis.data);
      setFactures(resFactures.data);
    } catch (err) {
      console.error("Erreur API", err);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS DEVIS ---
  const handleActionDevis = async (id, nouveauStatut) => {
    const action = nouveauStatut === 'envoye' ? 'accepter' : 'rejeter';
    if (!window.confirm(`Voulez-vous vraiment ${action} ce devis ?`)) return;

    try {
      await axios.put(`${API_BASE_URL}/devis/${id}/client-action`, { statut: nouveauStatut });
      alert("Votre décision a été enregistrée.");
      fetchInitialData();
    } catch (err) {
      alert("Erreur lors de la mise à jour du devis.");
    }
  };

  // --- LOGIQUE VÉHICULES ---
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/vehicules`, { ...newVehicle, client_id: user.id });
      setShowVehicleForm(false);
      fetchInitialData();
    } catch (err) { alert("Erreur ajout véhicule"); }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Supprimer ce véhicule ?')) {
      await axios.delete(`${API_BASE_URL}/vehicules/${id}`);
      fetchInitialData();
    }
  };

  // --- LOGIQUE RENDEZ-VOUS ---
  const handleAddAppt = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`${API_BASE_URL}/rendez-vous`, { ...newAppt, client_id: user.id });
        setShowApptForm(false);
        fetchInitialData();
    } catch (err) { alert("Erreur RDV"); }
  };

  const handleCancelAppt = async (id) => {
    if (window.confirm("Annuler ce RDV ?")) {
      await axios.put(`${API_BASE_URL}/rendez-vous/${id}/annuler`);
      fetchInitialData();
    }
  };

  // --- STYLES ---
  const styles = {
    container: { display: 'flex', backgroundColor: '#f8f9fc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    sidebar: { width: '280px', backgroundColor: '#fff', borderRight: '1px solid #e5e7eb', padding: '30px 20px', display: 'flex', flexDirection: 'column' },
    navItem: (active) => ({
      display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '12px',
      cursor: 'pointer', transition: '0.3s', marginBottom: '8px',
      backgroundColor: active ? '#dbb13b' : 'transparent',
      color: active ? '#fff' : '#666', fontWeight: active ? '700' : '500'
    }),
    main: { flex: 1, padding: '40px', overflowY: 'auto' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '25px', border: '1px solid #eff0f6', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '20px' },
    goldBtn: { backgroundColor: '#dbb13b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px', backgroundColor: '#f9f9f9' },
    badge: (status) => ({
        padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
        backgroundColor: status === 'valide' || status === 'paye' || status === 'termine' ? '#dcfce7' : status === 'refuse' || status === 'annulé' ? '#fee2e2' : '#fffbeb',
        color: status === 'valide' || status === 'paye' || status === 'termine' ? '#15803d' : status === 'refuse' || status === 'annulé' ? '#ef4444' : '#dbb13b'
    })
  };

  // --- RENDER : BILLING (DEVIS & FACTURES) ---
  const renderBilling = () => (
    <div>
      <h2 style={{fontSize: '24px', fontWeight: '900', marginBottom: '30px'}}>Mes Documents Financiers</h2>
      
      {/* SECTION DEVIS */}
      <div style={styles.card}>
        <h3 style={{marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}><FileText color="#dbb13b"/> Mes Devis</h3>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{textAlign:'left', color:'#999', fontSize:'12px', borderBottom:'1px solid #eee'}}>
              <th style={{padding:'15px'}}>DATE</th>
              <th style={{padding:'15px'}}>VÉHICULE</th>
              <th style={{padding:'15px'}}>MONTANT TTC</th>
              <th style={{padding:'15px'}}>STATUT</th>
              <th style={{padding:'15px', textAlign:'right'}}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {devis.map(d => (
              <tr key={d.id} style={{borderBottom:'1px solid #f9f9f9'}}>
                <td style={{padding:'15px'}}>{new Date(d.date_creation).toLocaleDateString()}</td>
                <td style={{padding:'15px'}}>{d.marque} {d.modele}</td>
                <td style={{padding:'15px'}}><b>{parseFloat(d.montant_ttc).toFixed(2)} MAD</b></td>
                <td style={{padding:'15px'}}><span style={styles.badge(d.statut)}>{d.statut}</span></td>
                <td style={{padding:'15px', textAlign:'right'}}>
                    <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                        {d.statut === 'brouillon' && (
                            <>
                                <button title="Accepter" onClick={() => handleActionDevis(d.id, 'envoye')} style={{border:'none', background:'#dcfce7', color:'#15803d', padding:'5px', borderRadius:'5px', cursor:'pointer'}}><Check size={18}/></button>
                                <button title="Refuser" onClick={() => handleActionDevis(d.id, 'refuse')} style={{border:'none', background:'#fee2e2', color:'#ef4444', padding:'5px', borderRadius:'5px', cursor:'pointer'}}><Ban size={18}/></button>
                            </>
                        )}
                        <button title="Télécharger" style={{border:'none', background:'#f3f4f6', color:'#666', padding:'5px', borderRadius:'5px', cursor:'pointer'}}><Download size={18}/></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SECTION FACTURES */}
      <div style={styles.card}>
        <h3 style={{marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}><CheckCircle color="#dbb13b"/> Mes Factures Payées</h3>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{textAlign:'left', color:'#999', fontSize:'12px', borderBottom:'1px solid #eee'}}>
              <th style={{padding:'15px'}}>N° FACTURE</th>
              <th style={{padding:'15px'}}>DATE</th>
              <th style={{padding:'15px'}}>VÉHICULE</th>
              <th style={{padding:'15px'}}>MONTANT</th>
              <th style={{padding:'15px', textAlign:'right'}}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {factures.map(f => (
              <tr key={f.id} style={{borderBottom:'1px solid #f9f9f9'}}>
                <td style={{padding:'15px'}}><b>{f.numero_facture}</b></td>
                <td style={{padding:'15px'}}>{new Date(f.date_facture).toLocaleDateString()}</td>
                <td style={{padding:'15px'}}>{f.marque} {f.modele}</td>
                <td style={{padding:'15px'}}><b>{parseFloat(f.montant_total_ttc).toFixed(2)} MAD</b></td>
                <td style={{padding:'15px', textAlign:'right'}}>
                   <button style={{border:'none', background:'#f3f4f6', color:'#666', padding:'8px 15px', borderRadius:'8px', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'5px'}}>
                      <Download size={16}/> PDF
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDashboard = () => {
    if (!dashboard) return <Loader2 className="animate-spin" color="#dbb13b" />;
    const steps = ["en_attente", "diagnostique", "reparation", "termine"];
    const labels = ["Réception", "Diagnostic", "Réparation", "Prêt"];
    const stepIndex = steps.indexOf(dashboard.last_reception?.statut || '');
    const percentage = stepIndex >= 0 ? (stepIndex / (steps.length - 1)) * 100 : 0;

    return (
      <div>
        <h2 style={{fontSize: '26px', fontWeight: '800', marginBottom: '10px'}}>Bonjour, {user.first_name} 👋</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px'}}>
          <div style={styles.card}>
            <div style={{display:'flex', gap:'15px', marginBottom:'15px'}}><Calendar color="#dbb13b" /> <b>Prochain RDV</b></div>
            {dashboard.next_rdv ? (
                <div style={{backgroundColor:'#fffbeb', padding:'15px', borderRadius:'12px', color:'#92400e'}}>
                    {new Date(dashboard.next_rdv.date_heure).toLocaleDateString()} à {new Date(dashboard.next_rdv.date_heure).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </div>
            ) : <p style={{color:'#999'}}>Aucun rendez-vous</p>}
          </div>
          <div style={styles.card}>
            <div style={{display:'flex', gap:'15px', marginBottom:'15px'}}><Car color="#dbb13b" /> <b>Mes Véhicules</b></div>
            <div style={{fontSize:'36px', fontWeight:'900', color:'#dbb13b'}}>{vehicles.length}</div>
          </div>
          <div style={{...styles.card, gridColumn: '1 / -1'}}>
            <h3>Suivi Atelier</h3>
            <div style={{backgroundColor:'#f9fafb', padding:'30px', borderRadius:'20px', marginTop:'15px'}}>
               <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                  <b>{dashboard.last_reception ? `${dashboard.last_reception.marque} ${dashboard.last_reception.modele}` : "Aucun véhicule"}</b>
                  <span style={{color:'#dbb13b'}}>{percentage.toFixed(0)}%</span>
               </div>
               <div style={{position:'relative', height:'4px', backgroundColor:'#e5e7eb'}}>
                  <div style={{position:'absolute', top:0, left:0, height:'100%', backgroundColor:'#dbb13b', width:`${percentage}%`}}></div>
                  <div style={{display:'flex', justifyContent:'space-between', position:'relative', top:'-13px'}}>
                     {labels.map((l, i) => (
                        <div key={i} style={{textAlign:'center'}}>
                           <div style={{width:'30px', height:'30px', borderRadius:'50%', backgroundColor: stepIndex >= i ? '#dbb13b' : '#fff', border:'2px solid #dbb13b', display:'flex', alignItems:'center', justifyContent:'center', color: stepIndex >= i ? '#fff' : '#dbb13b', fontWeight:'bold'}}>
                              {stepIndex > i ? <Check size={16}/> : i+1}
                           </div>
                           <span style={{fontSize:'10px', marginTop:'5px', display:'block'}}>{l}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVehicles = () => (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
        <h2 style={{fontSize: '24px', fontWeight: '900'}}>Mes Véhicules</h2>
        <button style={styles.goldBtn} onClick={() => setShowVehicleForm(!showVehicleForm)}><Plus size={18}/> Ajouter</button>
      </div>
      {showVehicleForm && (
        <div style={styles.card}>
           <form onSubmit={handleAddVehicle} style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
              <input style={styles.input} placeholder="Marque" onChange={e => setNewVehicle({...newVehicle, marque: e.target.value})} required />
              <input style={styles.input} placeholder="Modèle" onChange={e => setNewVehicle({...newVehicle, modele: e.target.value})} required />
              <input style={styles.input} placeholder="Immatriculation" onChange={e => setNewVehicle({...newVehicle, immatriculation: e.target.value})} required />
              <input style={styles.input} type="number" placeholder="KM" onChange={e => setNewVehicle({...newVehicle, kilometrage_actuel: e.target.value})} required />
              <button type="submit" style={{...styles.goldBtn, gridColumn:'span 2'}}>Enregistrer</button>
           </form>
        </div>
      )}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}}>
        {vehicles.map(v => (
          <div key={v.id} style={styles.card}>
            <div style={{display:'flex', justifyContent:'space-between'}}><Car color="#dbb13b" size={30} /><button onClick={() => handleDeleteVehicle(v.id)} style={{border:'none', background:'none', color:'#ff4d4d'}}><Trash2 size={18}/></button></div>
            <div style={{fontSize:'18px', fontWeight:'900', marginTop:'15px'}}>{v.marque} {v.modele}</div>
            <div style={{fontSize:'12px', fontWeight:'bold', color:'#999'}}>{v.immatriculation}</div>
            <div style={{fontSize:'13px', color:'#666', marginTop:'10px'}}><Wrench size={14}/> {v.kilometrage_actuel} km</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
        <h2 style={{fontSize: '24px', fontWeight: '900'}}>Mes Rendez-vous</h2>
        <button style={styles.goldBtn} onClick={() => setShowApptForm(!showApptForm)}><Plus size={18}/> Nouveau RDV</button>
      </div>
      {showApptForm && (
        <div style={styles.card}>
           <form onSubmit={handleAddAppt} style={{display:'grid', gap:'15px'}}>
              <select style={styles.input} required onChange={e => setNewAppt({...newAppt, vehicule_id: e.target.value})}>
                <option value="">-- Choisir véhicule --</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.marque} {v.modele}</option>)}
              </select>
              <input style={styles.input} placeholder="Motif" onChange={e => setNewAppt({...newAppt, motif: e.target.value})} required />
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                <input style={styles.input} type="date" onChange={e => setNewAppt({...newAppt, date: e.target.value})} required />
                <input style={styles.input} type="time" onChange={e => setNewAppt({...newAppt, heure: e.target.value})} required />
              </div>
              <button type="submit" style={styles.goldBtn}>Confirmer</button>
           </form>
        </div>
      )}
      <div style={styles.card}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id} style={{borderBottom:'1px solid #f9f9f9'}}>
                <td style={{padding:'15px'}}><b>{new Date(a.date_heure).toLocaleDateString()}</b></td>
                <td style={{padding:'15px'}}>{a.marque} {a.modele}</td>
                <td style={{padding:'15px'}}><span style={styles.badge(a.statut)}>{a.statut}</span></td>
                <td style={{textAlign:'right', padding:'15px'}}><button onClick={() => handleCancelAppt(a.id)} style={{color:'#ff4d4d', border:'none', background:'none'}}>Annuler</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={{textAlign:'center', marginBottom:'50px'}}><img src={Logo} alt="Logo" style={{width: '120px'}} /></div>
        <div style={styles.navItem(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}><LayoutDashboard size={20}/> Tableau de bord</div>
        <div style={styles.navItem(activeTab === 'vehicles')} onClick={() => setActiveTab('vehicles')}><Car size={20}/> Mes Véhicules</div>
        <div style={styles.navItem(activeTab === 'appointments')} onClick={() => setActiveTab('appointments')}><Calendar size={20}/> Mes Rendez-vous</div>
        <div style={styles.navItem(activeTab === 'billing')} onClick={() => setActiveTab('billing')}><FileText size={20}/> Devis & Factures</div>
        <div style={styles.navItem(activeTab === 'profile')} onClick={() => setActiveTab('profile')}><User size={20}/> Mon Profil</div>
        <div style={{marginTop:'auto', paddingTop:'20px', borderTop:'1px solid #f0f0f0', color:'#ff4d4d', cursor:'pointer', display:'flex', gap:'10px'}} onClick={onLogout}><LogOut size={20}/> Déconnexion</div>
      </div>
      <div style={styles.main}>
        {loading && <div style={{position:'absolute', top:'20px', right:'40px'}}><Loader2 className="animate-spin" color="#dbb13b" /></div>}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'vehicles' && renderVehicles()}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'billing' && renderBilling()}

        {activeTab === 'profile' && <div style={styles.card}><h2>Mon Profil</h2><p>Nom: {user.name}</p><p>Email: {user.email}</p></div>}

      </div>
    </div>
  );
};

export default EspaceAdmin;