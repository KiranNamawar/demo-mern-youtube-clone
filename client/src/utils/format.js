import { formatDistanceToNow } from "date-fns";

export function formatNumber(number) {
  if (isNaN(number)) return 0;
  else if (number < 1000) return number;
  else
    return Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(number);
}

export function timeAgo(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  }).replace("about ", "");
}
