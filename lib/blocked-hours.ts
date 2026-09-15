import { TIME_SLOTS, addMinutes } from "@/lib/business";
import { deleteItem, getItem, putItem, queryItems } from "@/lib/db";

export type BlockedDay = {
  date: string;
  times: string[];
};

const COLLECTION = "blocked";

function expandLegacyHourBlocks(times: string[]) {
  const hasHalfHour = times.some((time) => time.endsWith(":30"));
  if (hasHalfHour) return times;
  const expanded: string[] = [];
  for (const time of times) {
    expanded.push(time);
    if (time.endsWith(":00") && (TIME_SLOTS as readonly string[]).includes(addMinutes(time, 30))) {
      expanded.push(addMinutes(time, 30));
    }
  }
  return expanded;
}

export async function getBlockedTimes(date: string) {
  const item = await getItem(COLLECTION, date);
  const times = Array.isArray(item?.times) ? (item.times as string[]) : [];
  return new Set(expandLegacyHourBlocks(times));
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
      times: expandLegacyHourBlocks(Array.isArray(item.times) ? (item.times as string[]) : []),
    }))
    .filter((item) => new Date(`${item.date}T00:00:00`) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}
