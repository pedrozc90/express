export const getTimezone = (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
