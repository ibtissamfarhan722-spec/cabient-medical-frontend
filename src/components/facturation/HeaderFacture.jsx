import { MdNoteAdd } from 'react-icons/md'
import { Link } from 'react-router-dom'

const HeaderFacture = () => {
  return (
    <div className="facturation-header">
  <div className="facturation-title">
    <h2>Facturation</h2>
    <p>12 factures trouvées</p>
  </div>
  <Link to="/facturation/genererfacture" className="btn-generate">
    <MdNoteAdd />
    Générer une facture
  </Link>
</div>
  )
}

export default HeaderFacture