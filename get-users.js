import { db } from './src/firebase/config.js';
import { collection, getDocs } from 'firebase/firestore';

async function getUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'));
        console.log('--- USUARIOS EN FIRESTORE ---');
        querySnapshot.forEach((doc) => {
            console.log(`ID: ${doc.id}`);
            console.log(`Data:`, doc.data());
            console.log('---------------------------');
        });
    } catch (error) {
        console.error('Error getting users:', error);
    }
}

getUsers();
