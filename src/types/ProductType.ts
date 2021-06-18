export default class ProductType {
    productId?: number;
    productName?: string;
    productAmount?: number;
    shortDesc?: string;
    detailedDesc?: string;
    price?: number;
    imageUrl?: string;
    productStatus?: "available" | "visible" | "hidden";
    isPromoted?: number;
    prices?: {
        priceId: number;
        price: number;
    }[];
    images?: {
        imageId: number;
        imagePath: string;
    }[];
    categoryId?: number;
    category?: {
        categoryName: string;
    };
}