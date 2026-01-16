export const generateDate = (date?: string) => {
    return date ? new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) : undefined;    
} 