export const immutableSplice = (array: any[], start: number, count: number = 0, ...items) => {
    const newArray = [...array];
    newArray.splice(start, count, ...items);
    return newArray;
}