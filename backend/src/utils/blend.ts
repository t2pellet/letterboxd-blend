import Scraper from "@/services/scraper";
import TMDB from "@/services/tmdb";

export type BlendParams = {
  names: string[];
  top?: number; // int, min 1
  threshold?: number; // float, 0-1
};

async function getBlendedList({
  names = [],
  top = 10,
  threshold = 0.5,
}: BlendParams) {
  // Scrape watchlist entries from letterboxd
  const promises = names.map(async (name) => {
    const watchlist = await Scraper.getInstance().watchlist(name);
    return Object.values(watchlist.data).map((x) => ({
      slug: x.slug,
      user: name,
    }));
  });
  const allScrapedWatchlistEntries = await Promise.all(promises).then((r) =>
    r.flat(),
  );
  // Build map of watched movies
  const entryMap: Record<string, string[]> = {};
  allScrapedWatchlistEntries.forEach((entry) => {
    if (!entryMap[entry.slug]) {
      entryMap[entry.slug] = [];
    }
    entryMap[entry.slug].push(entry.user);
  });
  // Build sorted list from the map
  const minCount = Math.round(names.length * Number(threshold));
  const blendedList = Object.entries(entryMap)
    .filter(([, v]) => v.length >= minCount)
    .sort(([, v1], [, v2]) => v2.length - v1.length)
    .slice(0, top);
  // Populate with TMDB data
  const slugs = blendedList.map(([slug]) => slug);
  const resultsPromise = await Scraper.getInstance()
    .ids(slugs)
    .then((value) => {
      return value.map(async (r) => {
        const data = await TMDB.movie.getDetails({
          pathParameters: { movie_id: r.id },
        });
        return { ...r, users: entryMap[r.slug], data: data.data };
      });
    });
  return await Promise.all(resultsPromise);
}

export default getBlendedList;
export { getBlendedList };
