export default interface ApiProductDto {
    productId?: number;
    productName?: string;
    shortDesc?: string;
    detailedDesc?: string;
    prices?: {
        price: number;
        createdAt: string;
    }[],
    images?: {
        captionImage: string;
        imagePath: string;
    }[],
}