export interface WatchlistEntry {
  name: string;
  no: number;
  page: number;
  slug: string;
  url: string;
}

export default interface Watchlist {
  available: boolean;
  name: string;
  count: number;
  data: WatchlistEntry[];
  data_count: number;
  last_page: number;
}
