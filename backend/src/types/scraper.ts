export interface ListEntry {
  name: string;
  no: number;
  page: number;
  slug: string;
  url: string;
}

export default interface List {
  available: boolean;
  name: string;
  count: number;
  data: Record<number, ListEntry>;
  data_count: number;
  last_page: number;
}
