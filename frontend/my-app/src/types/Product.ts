export type Product = {
  name: string;
  brand: string;
  reviewRating?: number;
  count_feedbacks?: number;
  basic_price: number;
  product_price: number;
  discount_percent: number;
  images: string[];
  link: string;
  store: string;
  storeIcon: string;
};
