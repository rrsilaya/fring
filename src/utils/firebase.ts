import * as firebase from 'firebase';
import { Secrets } from 'utils/constants';

firebase.initializeApp({
    apiKey: Secrets.FIREBASE_API_KEY,
    databaseURL: Secrets.FIREBASE_DATABASE_URL,
});

export const db = firebase.database();
