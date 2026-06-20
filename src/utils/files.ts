const UNITS = ["B", "KB", "MB", "GB", "TB", "PB", "EB"] as const;

export const prettyBytes = (bytes: bigint | number, decimals: number = 2): string => {
    const n = typeof bytes === "bigint" ? Number(bytes) : bytes;

    if (n < 1024) return `${n} B`;

    let value = n;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < UNITS.length - 1) {
        value /= 1024;
        unitIndex++;
    }

    return `${parseFloat(value.toFixed(decimals))} ${UNITS[unitIndex]}`;
};
