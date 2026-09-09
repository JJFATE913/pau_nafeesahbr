import { TIME_SLOTS } from "@/lib/business";
import { deleteItem, getItem, putItem, queryItems } from "@/lib/db";

export type BlockedDay = {
  date: string;
  times: string[];
};

const COLLECTION = "blocked";

export async function getBlockedTimes(date: string) {
  const item = await getItem(COLLECTION, date);
  const times = Array.isArray(item?.times) ? (item.times as string[]) : [];
  return new Set(times);
}

export async function setBlockedTimes(date: string, times: string[]) {
  const unique = [
    ...new Set(times.filter((time) => (TIME_SLOTS as readonly string[]).includes(time))),
  ].sort();

  if (unique.length) {
    await putItem({ pk: COLLECTION, sk: date, date, times: unique });
  } else {
    await deleteItem(COLLECTION, date);
  }
  return unique;
}

export async function listUpcomingBlockedDays(): Promise<BlockedDay[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const items = await queryItems(COLLECTION);
  return items
    .map((item) => ({
      date: String(item.date),
      times: Array.isArray(item.times) ? (item.times as string[]) : [],
    }))
    .filter((item) => new Date(`${item.date}T00:00:00`) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}
