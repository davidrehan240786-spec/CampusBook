// coderabbit full review trigger
export function calculateBookAge(purchaseDate: string): string {
  if (!purchaseDate) return 'Age unknown';
  
  const purchase = new Date(purchaseDate);
  const now = new Date();
  
  // Set times to midnight to only compare dates
  purchase.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  if (purchase > now) return 'Recently listed';

  const diffInMs = now.getTime() - purchase.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Just bought';
  
  const diffInMonths = Math.floor(diffInDays / 30.4375); // More accurate average month
  const diffInYears = Math.floor(diffInDays / 365.25);

  if (diffInYears >= 1) {
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} old`;
  }
  if (diffInMonths >= 1) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} old`;
  }
  if (diffInDays >= 7) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} old`;
  }
  
  return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} old`;
}
