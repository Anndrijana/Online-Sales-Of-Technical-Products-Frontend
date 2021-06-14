import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Modal, Nav, Button, Table } from "react-bootstrap";
import api, { ApiResponse } from "../../api/api";
import ShoppingCartType from "../../types/ShoppingCartType";
import './shoppingCart.css';

interface ShoppingCartState {
    productCount: number;
    shoppingCart?: ShoppingCartType;
    shoppingCartVisible: boolean;
}

export default class ShoppingCart extends React.Component {
    state: ShoppingCartState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            productCount: 0,
            shoppingCartVisible: false,
        }
    }

    componentDidMount() {
        this.updateShoppingCart();

        window.addEventListener("shoppingCart.update", () => this.updateShoppingCart())
    }

    componentWillUnmount() {
        window.removeEventListener("shoppingCart.update", () => this.updateShoppingCart())
    }

    private setStateProductCount(newProductCount: number) {
        const newState = Object.assign(this.state, {
            productCount: newProductCount,
        });

        this.setState(newState);
    }

    private setStateShoppingCart(newShoppingCart?: number) {
        const newState = Object.assign(this.state, {
            shoppingCart: newShoppingCart,
        });

        this.setState(newState);
    }

    private setStateShoppingCartVisible(newShoppingCartVisible: boolean) {
        const newState = Object.assign(this.state, {
            shoppingCartVisible: newShoppingCartVisible,
        });

        this.setState(newState);
    }

    private showShoppingCart() {
        this.setStateShoppingCartVisible(true);
    }

    private removeShoppingCart() {
        this.setStateShoppingCartVisible(false);
    }

    private updateShoppingCart() {
        api('/api/shoppingCart/', 'get', {})
        .then((res: ApiResponse) => {
            
            if (res.status === 'login') {
                this.setStateProductCount(0);
                this.setStateShoppingCart(undefined);
                return;
            }

            this.setStateShoppingCart(res.data);
            this.setStateProductCount(res.data.productShoppingCarts.length);
        })
    }

    private calculateAllTotal(): number {
        let allTotal: number = 0;

        if(this.state.shoppingCart === undefined) {
            return allTotal;
        }

        for(const productShoppingCart of this.state.shoppingCart?.productShoppingCarts) {
            allTotal += (productShoppingCart.product.prices[productShoppingCart.product.prices.length-1].price * productShoppingCart.quantity)
        }

        return allTotal;
    }

    render() {
        return (
            <>
            <Nav.Item>
                <Nav.Link onClick ={ () => this.showShoppingCart() }>
                    <FontAwesomeIcon icon={ faCartPlus } size="lg" color="#FFF"/>
                    <div className="count">{this.state.productCount}</div>
                </Nav.Link>
            </Nav.Item>
            
            <Modal className="modal" size="lg" show= { this.state.shoppingCartVisible } onHide= { () => this.removeShoppingCart() }>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FontAwesomeIcon icon={ faShoppingCart } size="lg"></FontAwesomeIcon>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <Table hover size="sm">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th className="text-right">Quantity</th>
                                    <th className="text-right">Price</th>
                                    <th className="text-right">Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.shoppingCart?.productShoppingCarts.map(productShoppingCart => {

                                    return (
                                        <tr>
                                            
                                            <img src= { productShoppingCart.product.images[productShoppingCart.product.images?.length-1].imagePath } alt="" width="70px"></img>
                                            
                                            <td>{ productShoppingCart.product.productName }</td>
                                            <td>{ productShoppingCart.product.category.categoryName }</td>
                                            <td>{ productShoppingCart.quantity }</td>
                                            <td>
                                                {
                                                    Number(productShoppingCart.product.prices[productShoppingCart.product.prices.length-1].price)
                                                } EUR  
                                            </td>
                                            <td>
                                                {
                                                    Number(productShoppingCart.product.prices[productShoppingCart.product.prices.length-1].price * productShoppingCart.quantity)
                                                } EUR
                                            </td>
                                        </tr>
                                            )
                                }, this) }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="text-right">
                                        Total:
                                    </td>
                                    <td className="text-right">
                                        { this.calculateAllTotal() } EUR
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                </Modal.Body>

                <Modal.Footer>
                    <Button>Order</Button>
                </Modal.Footer>
            </Modal>
            </>
        )
    }
}