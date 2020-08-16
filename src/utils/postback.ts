export interface PostBack {
    type: string;
    data: string;
}

export const parsePostBack = (payload: string): PostBack => {
    const [, type, data] = payload.match(/(\w+):?(.*)/i);
    return { type, data };
}
