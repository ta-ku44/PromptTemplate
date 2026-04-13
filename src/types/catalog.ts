export type Item = {
  id: string;
  name: string;
  content: string;
  categoryId: string;
  fractionalIndex: string;
};

export type Category = {
  id: string;
  name: string;
  fractionalIndex: string;
};

export type Catalog = {
  items: Item[];
  categories: Category[];
};
