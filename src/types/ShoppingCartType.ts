export default interface ShoppingCartType {
    cartId: number;
    createdAt: string;
    customerId: number;
    productShoppingCarts: {
        productCartId: number;
        productId: number;
        quantity: number;
        product: {
            productName: string;
            category: {
                categoryId: number;
                categoryName: string;
            }
            prices: {
                priceId: number;
                price: number;
            }[]
            images: {
                imagePath: string;
            }[]
        }  
    }[]
}