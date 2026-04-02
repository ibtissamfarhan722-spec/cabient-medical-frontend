import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { supprimer } from '../../store/VehiculeReducer'
import ViewModal from './ViewModal'
import UpdateModal from './UpdateModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'

function VehiculeList({ Vehicule }) {
  const [showViewModal, setShowViewModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const dispatch = useDispatch()

  const handleConfirmDelete = () => {
    dispatch(supprimer(Vehicule.IdVehicule))
    setShowDeleteModal(false)
  }

  return (
    <>
      <tr>
        <td>{Vehicule.immatriculation}</td>
        <td>{Vehicule.marque}</td>
        <td>{Vehicule.modele}</td>
        <td>{Vehicule.annee}</td>
        <td>{Vehicule.kilometrage} km</td>
        <td>{Vehicule.client}</td>
        <td className="actions-cell">
          <button onClick={() => setShowViewModal(true)}><i style={{color:"blue"}} class="fa-regular fa-eye"></i></button>
          <button onClick={() => setShowUpdateModal(true)}><i style={{color:"green"}} class="fa-solid fa-pen"></i></button>
          <button onClick={() => setShowDeleteModal(true)}><i style={{color:"red"}} class="fa-solid fa-trash"></i></button>
        </td>
      </tr>

      {showViewModal && (
        <ViewModal vehicule={Vehicule} onClose={() => setShowViewModal(false)} />
      )}

      {showUpdateModal && (
        <UpdateModal vehicule={Vehicule} onClose={() => setShowUpdateModal(false)} />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  )
}

export default VehiculeList
