import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineFileDownload } from "react-icons/md";
import { Link } from "react-router-dom";

const ItemCard = ({
  numFacture,
  Patient,
  Date,
  Consultation,
  Montant,
  Paiement,
  Statut,
  deleteFacture,
}) => {
  return (
    <tr class="facture-row">
      <td class="facture-num">{numFacture}</td>
      <td class="facture-patient">
        <span class="patient-badge">{Patient.slice(0, 2).toUpperCase()}</span>
        <h4 class="patient-name">{Patient}</h4>
      </td>
      <td class="facture-date hide-md">{Date}</td>
      <td class="facture-consultation hide-md">{Consultation}</td>
      <td class="facture-montant">{Montant} €</td>
      <td class="facture-paiement hide-md">{Paiement}</td>
      <td class={`facture-statut hide-md ${Statut.toLowerCase().replace(" ", "-")}`}>{Statut}</td>
      <td class="facture-actions">
        <a href={`/facturation/${numFacture}`} class="action-btn view">
          <IoEyeOutline />
        </a>
        <a href={`/facturation/${numFacture}`} class="action-btn download">
          <MdOutlineFileDownload />
        </a>
        <button
          class="action-btn delete"
          onClick={() => deleteFacture(numFacture)}
        >
          <RiDeleteBin5Line />
        </button>
      </td>
    </tr>
  );
};

export default ItemCard;
