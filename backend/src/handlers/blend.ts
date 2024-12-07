import { RequestHandler } from "express";
import Scraper from "@/services/scraper";
import { ListEntry } from "@/types/scraper";
import { HttpStatusCodes } from "@/constants/http";
import TMDB from "@/services/tmdb";

const scraperService = Scraper.getInstance();

const getBlendHandler: RequestHandler = async (req, res) => {
  const { names, top, threshold } = req.params;
  const namesArray = names.split(",");
  const promises = namesArray.map((name) => {
    return scraperService.watchlist(name);
  });
  const responses = await Promise.all(promises);

  const entryMap: Record<string, { entry: ListEntry; users: string[] }> = {};
  responses.forEach((list) => {
    list.data.forEach((entry) => {
      if (!entryMap[entry.slug]) {
        entryMap[entry.slug] = { entry, users: [] };
      }
      entryMap[entry.slug].users.push(list.name);
    });
  });

  const minCount = Math.floor(names.length * Number(threshold));
  const blendedList = Object.values(entryMap)
    .filter(({ users }) => {
      return users.length >= minCount;
    })
    .sort(({ users: users1 }, { users: users2 }) => {
      return users1.length - users2.length;
    })
    .map((value) => ({
      slug: value.entry.slug,
      users: value.users,
    }))
    .slice(0, Number(top));

  const slugs = blendedList.reduce((res: string[], x) => {
    return [...res, x.slug];
  }, []);
  const ids = await scraperService.ids(slugs);

  // Do something
  return res.status(HttpStatusCodes.OK).send(blendedList);
};

export { getBlendHandler };
