import type { MarketplaceName } from "./marketplace";

export interface Products {
    name: string;
    brand: string;
    reviewRating: number;
    count_feedbacks: number;
    basic_price: number;
    product_price: number;
    discount_percent: number;
    images: string[];
    link: string;
    store: MarketplaceName;
}