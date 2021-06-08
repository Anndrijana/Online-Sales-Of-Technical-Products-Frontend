import ProductType from "./ProductType";

export default class CategoryType {
    categoryId?: number;
    categoryName?: string;
    imagePath?: string;
    items?: ProductType[];
}