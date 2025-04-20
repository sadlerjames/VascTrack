export const convertFirestoreTimestamp = (timestamp) => {
    try {
      if (timestamp instanceof Date) {
        // Already a Date object
        return timestamp;
      }
  
      if (typeof timestamp === 'string') {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          return date;
        }
        throw new Error(`Invalid date string: ${timestamp}`);
      }
  
      if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
        return new Date(timestamp.seconds * 1000);
      }
  
      throw new Error(`Unknown timestamp format: ${Object.prototype.toString.call(timestamp)} (${timestamp})`);
    } catch (error) {
      console.error("Error parsing date:", error);
      return new Date(); // Fallback
    }
  };
  