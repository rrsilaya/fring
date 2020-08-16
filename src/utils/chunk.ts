export const chunkMessage = (message: string, length = 1800): Array<string> => {
    const chunks = [];

    for (let chars = 0; chars < message.length; chars += length) {
        chunks.push(message.slice(chars, chars + length));
    }

    return chunks;
}
