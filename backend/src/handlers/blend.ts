import { RequestHandler } from "express";
import Scraper from "@/services/scraper";
import TMDB from "@/services/tmdb";
import { getData } from "@/utils/data";

const scraperService = Scraper.getInstance();

type BlendHandlerQuery = { names: string[]; top: number; threshold: number };
const getBlendHandler: RequestHandler = async (req, res) => {
  const { names, top, threshold } = getData<BlendHandlerQuery>(req);
  const minCount = Math.round(names.length * Number(threshold));

  const promises = names.map(async (name) => {
    const watchlist = await scraperService.watchlist(name);
    return Object.values(watchlist.data).map((x) => ({
      slug: x.slug,
      user: name,
    }));
  });
  const responses = await Promise.all(promises).then((r) => r.flat());

  // Build map of watched movies
  const entryMap: Record<string, string[]> = {};
  responses.forEach((entry) => {
    if (!entryMap[entry.slug]) {
      entryMap[entry.slug] = [];
    }
    entryMap[entry.slug].push(entry.user);
  });

  // Populate with slug and id and TMDB data
  const blendedList = Object.entries(entryMap)
    .filter(([, v]) => v.length >= minCount)
    .sort(([, v1], [, v2]) => v2.length - v1.length)
    .slice(0, top);
  const slugs = blendedList.map(([slug]) => slug);
  const resultsPromise = await scraperService.ids(slugs).then((value) => {
    return value.map(async (r) => {
      const data = await TMDB.movie.getDetails({
        pathParameters: { movie_id: r.id },
      });
      return { ...r, users: entryMap[r.slug], data: data.data };
    });
  });

  const results = await Promise.all(resultsPromise);
  res.status(200).send(results);
};

export { getBlendHandler };
export type { BlendHandlerQuery };
