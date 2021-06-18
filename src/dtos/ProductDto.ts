export default interface ApiProductDto {
    productId: number;
    productName: string;
    categoryId: string;
    shortDesc: string;
    detailedDesc: string;
    productStatus: "available" | "visible" | "hidden";
    productAmount: number;
    isPromoted: number;
    prices: {
        priceId: number;
        price: number;
    }[],
    images: {
        captionImage: string;
        imagePath: string;
    }[],
    category?: {
        categoryName: string;
    };
}