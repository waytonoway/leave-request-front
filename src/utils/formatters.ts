import { format } from 'date-fns';

export const formatDate = (date: Date): string => {
    return format(new Date(date), 'dd.MM.yyyy HH:mm');
};

export const calculateDays = (start: Date, end: Date) => {
    const timeDiff = end.getTime() - start.getTime();
    const diffDays = timeDiff / (1000 * 3600 * 24);

    return Math.floor(diffDays * 100) / 100;
};

export const calculateDaysFromRequest = (entity: Object) => {
    return calculateDays(new Date(entity.startDate), new Date(entity.endDate));
}
