"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { addTicket, fetchTickets } from '../redux/ticketSlice';

import { Ticket } from '../redux/ticketSlice';

import Modal from '../components/Modal';

import EditTicketModal from '../components/EditTicketModal';

import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';



const app = initializeApp({
  projectId: 'apisGabo',
  apiKey: 'AIzaSyBjxXSsZNWisaovHlS8aVrRA6uUbvzV2Ck',
  authDomain: 'apisgabo.firebaseapp.com',
});

const functions = getFunctions(app);

const Todo: React.FC = () => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc');
    const handleEditClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setSelectedTicket(null);
        setIsEditModalOpen(false);
    };


    const handleSort = () => {
        setOrderBy(orderBy === 'asc' ? 'desc' : 'asc');
    };


  const dispatch: AppDispatch = useDispatch();
  const { tickets, loading, error } = useSelector((state: RootState) => state.tickets);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTicket, setNewTicket] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'Técnico',
    fecha: '',
    prioridad: 'Alta',
    estado: 'Abierto',
  });

    interface FilterState {
        tipo: string;
        prioridad: string;
        estado: string;
        fechaFiltro: Date | null;
    }

    const [filter, setFilter] = useState<FilterState>({
        tipo: '',
        prioridad: '',
        estado: '',
        fechaFiltro: null
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };
    
    const filteredTickets = tickets
    .filter(ticket => {
        return (
        (filter.tipo === '' || ticket.tipo === filter.tipo) &&
        (filter.prioridad === '' || ticket.prioridad === filter.prioridad) &&
        (filter.estado === '' || ticket.estado === filter.estado)
        );
    })
    .sort((a, b) => {
        const dateA = a.fechaFiltro.getTime();
        const dateB = b.fechaFiltro.getTime();
        return orderBy === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  const handleEditModalSave = (updatedTicket: Ticket) => {
    const updateTicket = httpsCallable(functions, 'updateTicket');
    updateTicket({ updatedTicket }).then((result) => {
      const data = result.data;
      window.location.reload();
    });
  };

  const handleAddTicket = async () => {
    if (newTicket.titulo.trim() !== '') {
      
      let dataRecibida:any = {}
      const addTicket2 = httpsCallable(functions, 'addTicket2');
      await addTicket2({ newTicket }).then((result) => {
        dataRecibida = result.data;
        dataRecibida.fechaFiltro = new Date(dataRecibida.fecha._seconds * 1000);
        dataRecibida.fecha = new Date(dataRecibida.fecha._seconds * 1000).toLocaleString();
      });
      dispatch(addTicket(dataRecibida))
      setIsModalOpen(false);
      setNewTicket({
        titulo: '',
        descripcion: '',
        tipo: 'Técnico',
        fecha: '',
        prioridad: 'Alta',
        estado: 'Abierto'
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Listado de Tickets</h1>
      <div className="flex space-x-4 mb-4">
        <h2 className='text-2xl font-bold mb-4'>Filtros</h2>
      </div>
      <div className="flex flex-wrap space-x-4 mb-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-2">Tipo</label>
          <select name="tipo" value={filter.tipo} onChange={handleFilterChange} className="border p-2 rounded w-full">
            <option value="">Todos</option>
            <option value="Técnico">Técnico</option>
            <option value="Funcional">Funcional</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-2">Prioridad</label>
          <select name="prioridad" value={filter.prioridad} onChange={handleFilterChange} className="border p-2 rounded w-full">
            <option value="">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-2">Estado</label>
          <select name="estado" value={filter.estado} onChange={handleFilterChange} className="border p-2 rounded w-full">
            <option value="">Todos</option>
            <option value="Abierto">Abierto</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={handleSort} className="bg-blue-500 text-white p-2 rounded mb-4">Ordenar por Fecha</button>
        </div>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Crear Ticket
      </button>
      <EditTicketModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        ticket={selectedTicket}
        onSave={handleEditModalSave}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Crear Ticket</h2>
        <div className="mb-4">
          <label className="block mb-2">Titulo</label>
          <input
            type="text"
            name="titulo"
            value={newTicket.titulo}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Descripcion</label>
          <input
            type="text"
            name="descripcion"
            value={newTicket.descripcion}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Tipo</label>
          <select
            name="tipo"
            value={newTicket.tipo}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="Técnico">Técnico</option>
            <option value="Funcional">Funcional</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Prioridad</label>
          <select
            name="prioridad"
            value={newTicket.prioridad}
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
            value={newTicket.estado}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="Abierto">Abierto</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>
        <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white p-2 rounded mt-2 w-full">
          Cerrar
        </button>
        <button onClick={handleAddTicket} className="bg-blue-500 text-white p-2 rounded mt-2 w-full">
          Crear Ticket
        </button>
      </Modal>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="w-1/8 text-left py-2 px-4 bg-gray-200">ID</th>
            <th className="w-1/6 text-left py-2 px-4 bg-gray-200">Titulo</th>
            <th className="w-1/3 text-left py-2 px-4 bg-gray-200">Descripcion</th>
            <th className="w-1/6 text-left py-2 px-4 bg-gray-200">Tipo</th>
            <th className="w-1/6 text-left py-2 px-4 bg-gray-200">Prioridad</th>
            <th className="w-1/6 text-left py-2 px-4 bg-gray-200">Estado</th>
            <th className="w-1/3 text-left py-2 px-4 bg-gray-200">Fecha</th>
            <th className="w-1/6 text-left py-2 px-4 bg-gray-200">Editar</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket, index) => (
            <tr key={ticket.idTicket}>
              <td className="text-left py-2 px-4">{ticket.idTicket}</td>
              <td className="text-left py-2 px-4">{ticket.titulo}</td>
              <td className="text-left py-2 px-4">{ticket.descripcion}</td>
              <td className="text-left py-2 px-4">{ticket.tipo}</td>
              <td className="text-left py-2 px-4">{ticket.prioridad}</td>
              <td className="text-left py-2 px-4">{ticket.estado}</td>
              <td className="text-left py-2 px-4">{ticket.fecha}</td>
              <td className="text-left py-2 px-4">
                <button onClick={() => handleEditClick(ticket)} className="bg-yellow-500 text-white p-2 rounded">
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Todo;
