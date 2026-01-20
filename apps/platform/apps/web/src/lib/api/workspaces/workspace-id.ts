export const normalizeWorkspaceId = (id: string | undefined | null) => {
    if (!id) return "";
    return id;
};

export const isValidWorkspaceId = (id: string) => {
    return typeof id === "string" && id.length > 0;
};
