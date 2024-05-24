export const generateRandomNumbers = async (min: number, max: number, lastValue: number): Promise<number> => {
    if (lastValue === null) {
        return  Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
        const low: number = Math.max(min, lastValue - 1);
        const high: number = Math.min(max, lastValue + 1);
        return Math.floor(Math.random() * (high - low + 1)) + low;
    }
}