export const filterUnneeded = array => {
    const sorted = array.sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length / 4)];
    const q3 = sorted[Math.floor(sorted.length * (3 / 4))];
    const iqr = q3 - q1;
    const maxValue = q3 + iqr * 1.1;

    return sorted.filter(i => i < maxValue && i > 0);
}

export const mean = array => array.reduce((a, b) => a + b) / array.length;
