import { useState } from "react";
import ItemCard from "./ItemCard";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const CardsFacturations = ({ factures, deleteFacture }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const firstIndex = (currentPage - 1) * itemsPerPage;
  const lastIndex = currentPage * itemsPerPage;

  const currentItems = factures.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(factures.length / itemsPerPage);

  return (
    <table className="facture-table">
      <thead>
        <tr className="flex justify-between items-center bg-gray-100 py-5 px-5">
          <th>N° Facture</th>
          <th>Patient</th>
          <th className="hide-md">Date</th>
          <th className="hide-md">Consultation</th>
          <th>Montant</th>
          <th className="hide-md">Paiement</th>
          <th className="hide-md">Statut</th>
          <th className="md:table-cell">Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentItems.map((item) => (
          <ItemCard
            key={item.numFacture}
            numFacture={item.numFacture}
            Patient={item.Patient}
            Paiement={item.Paiement}
            Date={item.Date}
            Consultation={item.Consultation}
            Montant={item.Montant}
            Statut={item.Statut}
            deleteFacture={deleteFacture}
          />
        ))}
      </tbody>
      {totalPages > 0 && (
        <tfoot>
          <tr>
            <td className="pagination-info">
              {firstIndex + 1}-{Math.min(lastIndex, itemsPerPage)} sur{" "}
              {factures.length}
            </td>
            <td className="pagination-buttons">
              <GrFormPrevious
                className={`pagination-arrow ${
                  currentPage === 1 ? "disabled" : ""
                }`}
                onClick={() => setCurrentPage(currentPage - 1)}
              />
              {Array(totalPages)
                .fill(0)
                .map((_, i) => (
                  <span
                    key={i}
                    className={`pagination-page ${
                      i + 1 === currentPage ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </span>
                ))}
              <GrFormNext
                className={`pagination-arrow ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
};

export default CardsFacturations;
