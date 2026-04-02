import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Mail, Lock, Eye, EyeOff, Stethoscope, User, ShieldCheck, 
  CheckCircle2, MoveLeft, Phone, MapPin, CreditCard, Calendar, Droplet
} from 'lucide-react';

// --- 1. SCHÉMAS DE VALIDATION ZOD ---

const loginSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
});

const forgotSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
  confirmPassword: z.string().min(1, "Veuillez confirmer"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// Schéma de base pour l'utilisateur
const baseRegisterSchema = z.object({
  nom: z.string().min(2, "Nom requis"),
  prenom: z.string().min(2, "Prénom requis"),
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
  confirmPassword: z.string(),
});

// Champs spécifiques Médecin
const medecinFields = z.object({
  role: z.literal("medecin"),
  specialite: z.string().min(2, "Spécialité requise"),
  telephone: z.string().min(8, "Téléphone requis"),
  adresse: z.string().optional(),
  localisation: z.string().optional(),
});

// Champs spécifiques Patient
const patientFields = z.object({
  role: z.literal("patient"),
  cin: z.string().min(4, "CIN requis"),
  telephone: z.string().min(8, "Téléphone requis"),
  date_naissance: z.string().min(1, "Date de naissance requise"),
  groupe_sanguin: z.string().optional(),
  adresse: z.string().optional(),
});

// Champs spécifiques Secrétaire
const secretaireFields = z.object({
  role: z.literal("secretaire"),
});

// Union pour le formulaire d'inscription
const registerSchema = z.discriminatedUnion("role", [
  baseRegisterSchema.merge(medecinFields),
  baseRegisterSchema.merge(patientFields),
  baseRegisterSchema.merge(secretaireFields),
]).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    });
  }
});

// --- 2. COMPOSANT AUTH SYSTEM ---

const AuthSystem = ({ onAuthSuccess }) => {
  const [view, setView] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentSchema = view === 'login' ? loginSchema : (view === 'register' ? registerSchema : forgotSchema);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(currentSchema),
    mode: "onChange",
    defaultValues: view === 'register' ? { role: 'patient' } : {}
  });

  const selectedRole = watch("role");

  const switchView = (v) => { reset(); setView(v); setError(''); setSuccess(''); };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      
      if (view === 'login') {
        // Cas admin manuel
        if (data.email === 'admin@gmail.com' && data.password === 'admin123') {
           onAuthSuccess({ email: data.email, role: 'admin', nom: 'Admin' }, "token-admin");
        } else {
           const found = users.find(u => u.email === data.email && u.password === data.password);
           if (found) onAuthSuccess(found, "token-123");
           else setError("Identifiants incorrects.");
        }
      } 
      else if (view === 'register') {
        if (users.find(u => u.email === data.email)) {
          setError("Email déjà utilisé.");
        } else {
          users.push({ ...data, id: Date.now() });
          localStorage.setItem('mock_users', JSON.stringify(users));
          setSuccess("Compte créé ! Connectez-vous.");
          setTimeout(() => switchView('login'), 1500);
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.brandingHeader}>
        <div style={styles.logoBox}><Stethoscope color="white" size={28} /></div>
        <h1 style={styles.mainTitle}>Cabinet Médical</h1>
      </div>

      <div style={{...styles.authCard, maxWidth: view === 'register' ? '550px' : '420px'}}>
        <h2 style={styles.cardTitle}>
            {view === 'login' ? 'Connexion' : view === 'register' ? 'Créer un compte' : 'Réinitialisation'}
        </h2>

        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}><CheckCircle2 size={16} /> {success}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          
          {view === 'register' && (
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nom</label>
                <input {...register('nom')} placeholder="Nom" style={styles.input} />
                {errors.nom && <span style={styles.errorText}>{errors.nom.message}</span>}
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Prénom</label>
                <input {...register('prenom')} placeholder="Prénom" style={styles.input} />
                {errors.prenom && <span style={styles.errorText}>{errors.prenom.message}</span>}
              </div>
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input {...register('email')} placeholder="exemple@mail.com" style={styles.input} />
            </div>
            {errors.email && <span style={styles.errorText}>{errors.email.message}</span>}
          </div>

          {view === 'register' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Je suis un :</label>
              <div style={styles.inputWrapper}>
                <ShieldCheck size={18} style={styles.inputIcon} />
                <select {...register('role')} style={styles.input}>
                  <option value="patient">Patient</option>
                  <option value="medecin">Médecin</option>
                </select>
              </div>
            </div>
          )}

          {/* --- CHAMPS MÉDECIN --- */}
          {view === 'register' && selectedRole === 'medecin' && (
            <div style={styles.dynamicSection}>
               <div style={styles.inputGroup}>
                <label style={styles.label}>Spécialité</label>
                <input {...register('specialite')} placeholder="Ex: Cardiologue" style={styles.input} />
                {errors.specialite && <span style={styles.errorText}>{errors.specialite.message}</span>}
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Téléphone Professionnel</label>
                <input {...register('telephone')} placeholder="06..." style={styles.input} />
                {errors.telephone && <span style={styles.errorText}>{errors.telephone.message}</span>}
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Adresse du Cabinet</label>
                <input {...register('adresse')} placeholder="Rue..." style={styles.input} />
              </div>
            </div>
          )}

          {/* --- CHAMPS PATIENT --- */}
          {view === 'register' && selectedRole === 'patient' && (
            <div style={styles.dynamicSection}>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>CIN</label>
                    <input {...register('cin')} placeholder="AB123..." style={styles.input} />
                    {errors.cin && <span style={styles.errorText}>{errors.cin.message}</span>}
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Date de Naissance</label>
                    <input type="date" {...register('date_naissance')} style={styles.input} />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Téléphone</label>
                <input {...register('telephone')} placeholder="06..." style={styles.input} />
                {errors.telephone && <span style={styles.errorText}>{errors.telephone.message}</span>}
              </div>
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="••••••••" style={styles.input} />
              <div onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {errors.password && <span style={styles.errorText}>{errors.password.message}</span>}
          </div>

          {view !== 'login' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirmation</label>
              <input type={showPassword ? 'text' : 'password'} {...register('confirmPassword')} placeholder="••••••••" style={styles.input} />
              {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword.message}</span>}
            </div>
          )}

          {view === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <span onClick={() => switchView('forgot')} style={styles.greenLink}>Mot de passe oublié ?</span>
            </div>
          )}

          <button type="submit" disabled={isLoading} style={styles.submitBtn}>
            {isLoading ? "Chargement..." : (view === 'login' ? "Se connecter" : "Valider")}
          </button>
        </form>

        <div style={styles.cardFooter}>
          {view === 'login' ? (
            <>Nouveau ? <span onClick={() => switchView('register')} style={styles.greenLinkBold}>Créer un compte</span></>
          ) : (
            <div onClick={() => switchView('login')} style={styles.backBtn}>
               <MoveLeft size={16} /> Retour
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f4f8', padding: '20px', fontFamily: 'sans-serif' },
  brandingHeader: { textAlign: 'center', marginBottom: '20px' },
  logoBox: { backgroundColor: '#2E8B7F', width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' },
  mainTitle: { color: '#1a3352', fontSize: '22px', fontWeight: '700', margin: 0 },
  authCard: { backgroundColor: 'white', width: '100%', padding: '35px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', transition: 'all 0.3s' },
  cardTitle: { fontSize: '20px', fontWeight: '700', color: '#1a3352', marginBottom: '20px', textAlign: 'center' },
  row: { display: 'flex', gap: '15px' },
  inputGroup: { marginBottom: '15px', flex: 1 },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
  inputWrapper: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' },
  input: { width: '100%', padding: '11px 15px 11px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  eyeIcon: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#cbd5e1' },
  errorText: { color: '#ef4444', fontSize: '11px', marginTop: '4px' },
  errorAlert: { backgroundColor: '#fef2f2', color: '#ef4444', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px' },
  successAlert: { backgroundColor: '#f0fdf4', color: '#16a34a', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' },
  greenLink: { color: '#2E8B7F', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  greenLinkBold: { color: '#2E8B7F', fontWeight: '700', cursor: 'pointer' },
  submitBtn: { width: '100%', backgroundColor: '#2E8B7F', color: 'white', padding: '13px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  cardFooter: { textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#94a3b8' },
  backBtn: { color: '#2E8B7F', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' },
  dynamicSection: { padding: '15px', backgroundColor: '#f1f5f9', borderRadius: '12px', marginBottom: '15px', border: '1px dashed #cbd5e1' }
};

export default AuthSystem;