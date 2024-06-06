import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

export interface Ticket {
    titulo: string;
    descripcion: string;
    tipo: string;
    prioridad: string;
    estado: string;
    fecha: string;
    idBD: string;
    idTicket: number;
    fechaFiltro: Date | null;
}

interface TicketState {
    tickets: Ticket[];
    loading: boolean;
    error: string | null;
}

// Inicializar Firebase
const app = initializeApp({
    projectId: 'apisGabo',
    apiKey: 'AIzaSyBjxXSsZNWisaovHlS8aVrRA6uUbvzV2Ck',
    authDomain: 'apisgabo.firebaseapp.com',
});

const functions = getFunctions(app);
const getTicket = httpsCallable(functions, 'getTicket');

// Definir el thunk asíncrono para obtener los tickets
export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async () => {
    const result:any = await getTicket({});
    return result.data.map((ticket: any) => ({
        ...ticket,
        fechaFiltro: new Date(ticket.fecha._seconds * 1000),
        fecha: new Date(ticket.fecha._seconds * 1000).toLocaleString()
        
    })) as Ticket[];
});

const initialState: TicketState = {
    tickets: [],
    loading: false,
    error: null,
};

const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        addTicket: (state, action: PayloadAction<Ticket>) => {
            state.tickets.push(action.payload);
        }
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action: PayloadAction<Ticket[]>) => {
                state.tickets = action.payload;
                state.loading = false;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tickets';
            });
    }
});

export const { addTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
