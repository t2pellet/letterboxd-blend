export interface Following {
  name: string;
  following: { [slug: string]: { display_name: string } };
}
