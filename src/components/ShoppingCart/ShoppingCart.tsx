import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faShoppingCart, faTrashAlt, faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Modal, Nav, Button, Table, Form, Alert } from "react-bootstrap";
import api, { ApiResponse } from "../../api/api";
import ShoppingCartType from "../../types/ShoppingCartType";
import './shoppingCart.css';
import { Link } from 'react-router-dom';

interface ShoppingCartState {
    productCount: number;
    shoppingCart?: ShoppingCartType;
    shoppingCartVisible: boolean;
    message: string;
    error: string;
}

export default class ShoppingCart extends React.Component {
    state: ShoppingCartState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            productCount: 0,
            shoppingCartVisible: false,
            message: '',
            error: ''
        }
    }

    componentDidMount() {
        this.updateShoppingCart();

        window.addEventListener("shoppingCart.update", () => this.updateShoppingCart())
    }

    componentWillUnmount() {
        window.removeEventListener("shoppingCart.update", () => this.updateShoppingCart())
    }

    private setStateMessage(newMessage: string) {
        this.setState(Object.assign(this.state, { message: newMessage }));
    }

    private setStateError(newError: string) {
        this.setState(Object.assign(this.state, { error: newError }));
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
        if(this.state.shoppingCart?.productShoppingCarts.length === 0) {
            this.setStateShoppingCartVisible(true);
            this.setStateMessage(( <p className="p">
            Your shopping cart is empty! Continue your shopping...<br/>
            <Link className="link" to='/categories'>HERE</Link>
        </p>
                ) as any);
                return;
            
        }

        this.setStateMessage('');
        this.setStateShoppingCartVisible(true);
    }

    private removeShoppingCart() {
        this.setStateShoppingCartVisible(false);
    }

    private updateShoppingCart() {
        api('/api/shoppingCart/', 'get', {})
        .then((res: ApiResponse) => {

            if (res.status === 'error') {
                this.setStateProductCount(0);
                this.setStateShoppingCart(undefined);
                return;
            }
            
            if (res.status === 'login') {
                this.setStateProductCount(0);
                this.setStateShoppingCart(undefined);
                return;
            }


            this.setStateShoppingCart(res.data);
            this.setStateProductCount(res.data.productShoppingCarts.length);

            
            /*if(res.data.productShoppingCarts.length === 0) {
                this.setStateMessage(( <p className="p">
                Your shopping cart is empty! Continue your shopping...<br/>
                <Link className="link" to='/categories'>HERE</Link>
            </p>
                    ) as any);
                    return;
                
            }

            else {
                this.setStateShoppingCart(res.data);
                this.setStateProductCount(res.data.productShoppingCarts.length);
                return;
            }*/
            
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

    private sendShoppingCartUpdate(data: any) {
        api('/api/shoppingCart', 'patch', data)
        .then((res: ApiResponse) => {

            if (res.status === 'login') {
                this.setStateProductCount(0);
                this.setStateShoppingCart(undefined);
                return;
            }

            this.setStateShoppingCart(res.data);
            this.setStateProductCount(res.data.productShoppingCarts.length);
        });
    }

    private changingQuantity(event: React.ChangeEvent<HTMLInputElement>) {
        const productId = event.target.dataset.productId;
        const newQuantity = event.target.value;

        this.sendShoppingCartUpdate({
            productId: productId,
            quantity: newQuantity,
        });
    }

    private removeFromShoppingCart(productId: number) {

        this.sendShoppingCartUpdate({
            productId: productId,
            quantity: 0,
        });
       
        this.setStateMessage('You have successfully deleted the product!')

    }
 
    private placeOrder() {
        api('/api/shoppingCart/createOrder', 'post', {})
        .then((res: ApiResponse) => {

            if (res.status === 'error') {

                this.setStateError(( <p className="p">
                <FontAwesomeIcon icon={ faExclamationCircle } color="red" size="lg"></FontAwesomeIcon><br/>

                SORRY...<br/>
                Some of these products is currently out of stock.<br/>
                Continue your shopping...<br/>
                <Link className="link" to='/categories'>HERE</Link>
                </p>
                    ) as any)

                this.setStateProductCount(0);
                this.setStateShoppingCart(undefined);
             
                return;
            }
            

            if (res.status === 'login') {
                this.setStateProductCount(0);
                this.setStateShoppingCart(undefined);
                return;
            }

            this.setStateMessage(( <p className="p">
            <FontAwesomeIcon icon={ faCheckCircle } color="green" size="lg"></FontAwesomeIcon><br/>

            Your order has been successful made!<br/>
            Continue your shopping...<br/>
            <Link className="link" to='/categories'>HERE</Link>
        </p>
                ) as any);

            this.setStateShoppingCart(undefined);
            this.setStateProductCount(0);
        });

       if( this.state.productCount === 0) {

            this.setStateError('The product has already been ordered!');

        }
       
    }

    private hide() {
        this.setStateMessage('');
        this.setStateError('');
        this.setStateShoppingCartVisible(false);
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
            
            <Modal size="xl" show= { this.state.shoppingCartVisible } onHide= { () => this.hide() }>
                <Modal.Header closeButton>
                   
                    <Modal.Title>
                        <strong>
                        <FontAwesomeIcon icon={ faShoppingCart } size="lg" color="#149dff"></FontAwesomeIcon> Your shopping cart
                        </strong>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <Table hover>
                            <thead className="thead">
                                <tr>
                                    <th className="th">Image</th>
                                    <th className="th">Product</th>
                                    <th className="th">Category</th>
                                    <th className="th">Quantity</th>
                                    <th className="th">Price of one product</th>
                                    <th className="th">Total price</th>
                                    <th className="th">Remove product</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.shoppingCart?.productShoppingCarts.map(productShoppingCart => {

                                    return (
                                        <tr className="active">
                                            
                                            <img src= { productShoppingCart.product.images[productShoppingCart.product.images?.length-1].imagePath } alt="" width="95px"></img>
                                            
                                            <td>{ productShoppingCart.product.productName }</td>
                                            <td>{ productShoppingCart.product.category.categoryName }</td>
                                            <td>
                                            <Form.Control className="quantity" type="number" step="1" min="1"
                                                              value={ productShoppingCart.quantity }
                                                              data-product-id = { productShoppingCart.product.productId }
                                                              onChange={ (e) => this.changingQuantity(e as any) }
                                            />
                                            </td>
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
                                            <td>
                                                <FontAwesomeIcon icon={faTrashAlt}
                                                 
                                                 onClick = {(e) => this.removeFromShoppingCart(productShoppingCart.product.productId)}
                                                ></FontAwesomeIcon>
                            
                                            </td>
                                        </tr>
                                            )
                                }, this) }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        Total:
                                    </td>
                                    <td>
                                        { this.calculateAllTotal() } EUR
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>

                        <Alert variant="success" className={ this.state.message ? '' : 'd-none' }>
                            { this.state.message }
                        </Alert>

                        <Alert variant="danger" className={ this.state.error ? '' : 'd-none' }>
                            { this.state.error }
                        </Alert>
                </Modal.Body>

                <Modal.Footer>
                    <Button className="button" onClick={ () => this.placeOrder() }
                    disabled = { this.state.shoppingCart?.productShoppingCarts.length === 0 }>Place your order</Button>
                </Modal.Footer>
            </Modal>
            </>
        )
    }
}