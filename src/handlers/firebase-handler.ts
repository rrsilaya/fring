import { db } from 'utils';

class FirebaseHandler {
    savePaginatedThread = async (userId: string, messages: Array<string>) => {
        const ref = await db.ref(`/threads/${userId}`).push(messages);
        return ref.key;
    }

    removeChunk = async (userId: string, threadId: string, index: number) => {
        await db.ref(`/threads/${userId}/${threadId}/${index}`).remove();
    }

    getChunk = async (userId: string, threadId: string, index: number) => {
        const snapshot = await db.ref(`/threads/${userId}/${threadId}/${index}`).once('value');
        return snapshot.val();
    }
}

export default FirebaseHandler;
