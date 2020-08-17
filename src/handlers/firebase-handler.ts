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
        const threadSnapshot = await db.ref(`/threads/${userId}/${threadId}`).once('value');

        return {
            text: snapshot.val(),
            pagesLeft: threadSnapshot.numChildren() - 1,
        };
    }
}

export default FirebaseHandler;
