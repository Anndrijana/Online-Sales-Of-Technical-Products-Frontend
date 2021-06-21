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
        imageId: number;
        captionImage: string;
        imagePath: string;
    }[],
    category?: {
        categoryId: number;
        categoryName: string;
    };
}