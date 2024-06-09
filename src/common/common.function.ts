export const getSkip = (page: number, limit: number): { skip?: number; take?: number } => {
    limit = limit > 100 ? 100 : limit;
    if (limit === Infinity || !limit) {
        return {};
    }
    const skip = page < 1 ? 0 : (page - 1) * limit;
    return { skip, take: limit };
};
