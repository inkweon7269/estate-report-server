export const getSkip = (page: number, limit: number): { skip?: number; take?: number } => {
    limit = limit > 100 ? 100 : limit;
    if (limit === Infinity || !limit) {
        return {};
    }
    const skip = page < 1 ? 0 : (page - 1) * limit;
    return { skip, take: limit };
};

export const calcListTotalCount = (
    totalCount: number = 0,
    limit: number = 0,
): { totalResult: number; totalPage: number } => {
    const totalResult = totalCount;
    const totalPage = totalResult % limit === 0 ? totalResult / limit : Math.floor(totalResult / limit) + 1;
    return { totalResult, totalPage };
};
