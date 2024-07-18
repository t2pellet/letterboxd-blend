export interface Followers {
  name: string;
  followers: { [slug: string]: { display_name: string } };
}
