import * as firebase from 'firebase';
import * as dotenv from 'dotenv';

dotenv.config();

const {
    FIREBASE_DATABASE_URL,
    FIREBASE_API_KEY,
} = process.env;

firebase.initializeApp({
    apiKey: FIREBASE_API_KEY,
    databaseURL: FIREBASE_DATABASE_URL,
});

export const db = firebase.database();
