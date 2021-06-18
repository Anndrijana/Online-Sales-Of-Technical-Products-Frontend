import ShoppingCartType from "../types/ShoppingCartType";

export default interface ApiOrderDto {
    orderId: number;
    createdAt: string;
    cartId: number;
    orderStatus: 'accepted' | 'rejected' | 'shipped' | 'unresolved';
    cart: ShoppingCartType;
}