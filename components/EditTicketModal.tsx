import React, { useState, useEffect } from 'react';
import { Ticket } from '../redux/ticketSlice';
import Modal from './Modal';

interface EditTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onSave: (updatedTicket: Ticket) => void;
}

const EditTicketModal: React.FC<EditTicketModalProps> = ({ isOpen, onClose, ticket, onSave }) => {
  const [editedTicket, setEditedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    setEditedTicket(ticket);
  }, [ticket]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editedTicket) {
      setEditedTicket({ ...editedTicket, [name]: value });
      console.log(editedTicket);
    }
  };

  const handleSave = () => {
    if (editedTicket) {
      onSave(editedTicket);
      onClose();
    }
  };
  const handleClose = () => {
      onClose();

  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {editedTicket && (
        <div>
          <h2 className="text-xl font-bold mb-4">Edit Ticket</h2>
          <div className="mb-4">
          <label className="block mb-2">Prioridad</label>
          <select
            name="prioridad"
            value={editedTicket.prioridad}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Estado</label>
          <select
            name="estado"
            value={editedTicket.estado}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            disabled = {editedTicket.estado == 'Cerrado'}
          >
            <option value="Abierto">Abierto</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>
          <button onClick={handleClose} className="bg-red-500 text-white p-2 rounded mt-2 w-full">
            Cerrar
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded mt-2 w-full">
            Guardar
          </button>
        </div>
      )}
    </Modal>
  );
};

export default EditTicketModal;
