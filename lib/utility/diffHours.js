function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
}
  
export const differenceInHours = (symptom, dose) => {
    if (!symptom || !dose) {
        console.warn('Missing input(s)', { symptom, dose });
        return null;
    }

    if (!isValidDate(symptom) || !isValidDate(dose)) {
        console.warn('Invalid date(s)', { symptom, dose });
        return null;
    }

    const diffMs = symptom.getTime() - dose.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    return diffHrs;
}