export default interface ShoppingCartType {
    cartId: number;
    createdAt: string;
    customerId: number;
    customer: any;
    productShoppingCarts: {
        productCartId: number;
        productId: number;
        quantity: number;
        product: {
            productId: number;
            productName: string;
            productAmount: number;
            category: {
                categoryId: number;
                categoryName: string;
            }
            prices: {
                priceId: number;
                createdAt: string;
                price: number;
            }[]
            images: {
                imagePath: string;
            }[]
        }  
    }[]
}