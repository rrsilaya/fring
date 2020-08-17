import { db } from 'utils';

export interface ChunkData {
    text: string,
    pagesLeft: number,
}

class FirebaseHandler {
    savePaginatedThread = async (userId: string, messages: Array<string>): Promise<string|null> => {
        const ref = await db.ref(`/threads/${userId}`).push(messages);
        return ref.key;
    }

    removeChunk = async (userId: string, threadId: string, index: number): Promise<void> => {
        await db.ref(`/threads/${userId}/${threadId}/${index}`).remove();
    }

    getChunk = async (userId: string, threadId: string, index: number): Promise<ChunkData> => {
        const snapshot = await db.ref(`/threads/${userId}/${threadId}/${index}`).once('value');
        const threadSnapshot = await db.ref(`/threads/${userId}/${threadId}`).once('value');

        return {
            text: snapshot.val(),
            pagesLeft: threadSnapshot.numChildren() - 1,
        };
    }
}

export default FirebaseHandler;
