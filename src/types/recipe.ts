export type Recipe = {
  id: string;
  title: string;
  ingredients: string;
  tags: string[] | null;
  image_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};
