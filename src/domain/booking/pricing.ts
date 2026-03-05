export function calcBookingTotal(hours: number, petCount: number) {
    const safeHours = Math.max(0, hours || 0);
    const count = Math.max(0, petCount || 0);
  
    if (count === 0) return 0;
  
    const base = safeHours * 200;
    const extra = (count - 1) * 300;
  
    return base + extra;
  }