import ShoppingCartType from "./ShoppingCartType";

export default interface OrderType {
    orderId: number;
    createdAt: string;
    orderStatus: string;
    cart: ShoppingCartType;
}