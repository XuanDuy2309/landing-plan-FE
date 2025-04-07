
export const isValidPolygon = (data: any): boolean => {
    return (
        Array.isArray(data) &&
        data.length > 0 &&
        data.every(
            (point: any) =>
                Array.isArray(point) &&
                point.length === 2 &&
                typeof point[0] === 'number' &&
                typeof point[1] === 'number'
        )
    );
};
