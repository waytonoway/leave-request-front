// Your existing code here
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];  // Just an example
};
