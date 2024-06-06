import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { httpsCallable } from "firebase/functions";

const app = initializeApp({
    projectId: 'apisGabo',
    apiKey: 'AIzaSyBjxXSsZNWisaovHlS8aVrRA6uUbvzV2Ck',
    authDomain: 'apisgabo.firebaseapp.com',
  });
const functions = getFunctions(app);

let tickets = []

const here = this

const getTickets = httpsCallable(functions, 'getTickets');
getTickets({ })
.then((result) => {
    // Read result of the Cloud Function.
    /** @type {any} */
    const data = result.data;
    console.log(data)
    
});

