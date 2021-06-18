import { faCalendarAlt, faShippingFast, faShoppingBasket, faShoppingBag, faInfo, faMousePointer, faFastBackward, faStepBackward, faStepForward, faFastForward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Container, Modal, Table, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import OrderType from '../../types/OrderType';
import ShoppingCartType from '../../types/ShoppingCartType';
import './orders.css';

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

interface OrderState {
    isCustomerLoggedIn: boolean;
    customerOrders: OrderType[];
    shoppingCartVisible: boolean;
    shoppingCart?: ShoppingCartType;
    currentPage: number;
    ordersPerPage: number;
}

interface OrderDto {
    orderId: number;
    orderStatus: 'accepted' | 'rejected' | 'shipped' | 'unresolved';
    createdAt: string;
    cart: {
        cartId: number;
        createdAt: string;
        productShoppingCarts: {
            quantity: number;
            product: {
                productId: number;
                productName: string;
                productAmount: number;
                shortDesc: string;
                productStatus: "available" | "visible" | "hidden";
                isPromoted: number;
                category: {
                    categoryId: number;
                    categoryName: string;
                },
                prices: {
                    createdAt: string;
                    price: number;
                }[];
                images: {
                    imagePath: string;
                }[];
            };
        }[];
    };
}

export default class Pagination extends React.Component {
    state: OrderState;

    constructor(props: Readonly<{}>) {
        super(props);
        
        this.state = {
            isCustomerLoggedIn: true,
            customerOrders: [],
            shoppingCartVisible: false,
            currentPage: 1,
            ordersPerPage: 14
        }
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

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isCustomerLoggedIn: isLoggedIn,
        });
    
        this.setState(newState);
    }

    private setOrdersState(customerOrders: OrderType[]) {
        const newState = Object.assign(this.state, {
            customerOrders: customerOrders,
        });
    
        this.setState(newState);
    }

    private setShoppingCartState(shoppingCart: ShoppingCartType) {
        this.setState(Object.assign(this.state, {
            shoppingCart: shoppingCart,
        }));
    }

    private getCustomerOrders() {
        api('/api/shoppingCart/orders/', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                return this.setLogginState(false);
            }

            /*const data: OrderDto[] = res.data;*/

            const customerOrders: OrderType[] = res.data.map( (order: OrderDto) => {
                const object: OrderType = {
                orderId: order.orderId,
                createdAt: order.createdAt,
                orderStatus: order.orderStatus,
                cart: {
                    cartId: order.cart.cartId,
                    createdAt: order.cart.createdAt,
                    customer: null,
                    customerId: 0,
                    productShoppingCarts: order.cart.productShoppingCarts.map(cp => ({
                        productCartId: 0,
                        productId: cp.product.productId,
                        quantity: cp.quantity,
                        product: {
                            productId: cp.product.productId,
                            productName: cp.product.productName,
                            productAmount: cp.product.productAmount,
                            category: {
                                categoryId: cp.product.category.categoryId,
                                categoryName: cp.product.category.categoryName,
                            },
                            prices: cp.product.prices.map(pp => ({
                                priceId: 0,
                                createdAt: pp.createdAt,
                                price: pp.price,
                            })),
                            images: cp.product.images.map(ip => ({
                                imagePath: ip.imagePath,
                            }))
                        }
                    }))
                }
                }

                return object;
            });

            /*const customerOrders: OrderType[] = data.map(order => ({
                orderId: order.orderId,
                orderStatus: order.orderStatus,
                createdAt: order.createdAt,
                cart: {
                    cartId: order.cart.cartId,
                    createdAt: order.cart.createdAt,
                    customer: null,
                    customerId: 0,
                    productShoppingCarts: order.cart.productShoppingCarts.map(cp => ({
                        productCartId: 0,
                        productId: cp.product.productId,
                        quantity: cp.quantity,
                        product: {
                            productId: cp.product.productId,
                            productName: cp.product.productName,
                            productAmount: cp.product.productAmount,
                            category: {
                                categoryId: cp.product.category.categoryId,
                                categoryName: cp.product.category.categoryName,
                            },
                            prices: cp.product.prices.map(pp => ({
                                priceId: 0,
                                createdAt: pp.createdAt,
                                price: pp.price,
                            })),
                            images: cp.product.images.map(ip => ({
                                imagePath: ip.imagePath,
                            }))
                        }
                    }))
                }
            }))*/

            this.setOrdersState(customerOrders);
        });

    }

    componentDidMount() {
        this.getCustomerOrders()
    }

    componentDidUpdate() {
        this.getCustomerOrders()
    }

    private getLatestPriceBeforeDate(product: any, latestDate: any) {
        const cartDateAndTime = new Date(latestDate).getTime();

        let price = product.prices[0];

        for (let p of product.prices) {
            const priceDateAndTime = new Date(p.createdAt).getTime();

            if (priceDateAndTime < cartDateAndTime) {
                price = p;
            } else {
                break;
            }
        }

        return price;
    }

    private calculateAllTotal(): number {
        let total: number = 0;

        if (this.state.shoppingCart === undefined) {
            return total;
        } else {
            for (const item of this.state.shoppingCart?.productShoppingCarts) {
                let price = this.getLatestPriceBeforeDate(item.product, this.state.shoppingCart.createdAt);
                total += price.price * item.quantity;
            }
        }

        return total;
    }

    private changePage(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            [event.target.name]: parseInt(event.target.value)
        });
    }

    firstPage = () => {
        if(this.state.currentPage > 1) {
            this.setState({
                currentPage: 1
            });
        }
    };

    prevPage = () => {
        if(this.state.currentPage > 1) {
            this.setState({
                currentPage: this.state.currentPage - 1
            });
        }
    };

    lastPage = () => {
        if(this.state.currentPage < Math.ceil(this.state.customerOrders.length / this.state.ordersPerPage)) {
            this.setState({
                currentPage: Math.ceil(this.state.customerOrders.length / this.state.ordersPerPage)
            });
        }
    };

    nextPage = () => {
        if(this.state.currentPage < Math.ceil(this.state.customerOrders.length / this.state.ordersPerPage)) {
            this.setState({
                currentPage: this.state.currentPage + 1
            });
        }
    };

    render() {
        if (this.state.isCustomerLoggedIn === false) {
            return (
                <Redirect to="/customer/login" />
            );
        }
        
        const {customerOrders, currentPage, ordersPerPage} = this.state;
        
        const totalPages = Math.floor(customerOrders.length / ordersPerPage)+1;

        return (
            <Container>
            <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faShoppingBasket } size="lg" color ="#149dff"/> Your all orders
                        </Card.Title>

                        <Table hover size="sm">
                            <thead>
                                <tr className="tr">
                                    <th>
                                    <FontAwesomeIcon icon={ faCalendarAlt } color ="white" size="lg"></FontAwesomeIcon> Created at</th>
                                    <th>
                                    <FontAwesomeIcon icon={ faShippingFast } color ="white" size="lg"></FontAwesomeIcon> Status</th>
                                    <th>
                                    <FontAwesomeIcon icon={ faMousePointer } color ="white" size="lg"></FontAwesomeIcon> More information
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.customerOrders.map(this.print, this) } 
                            </tbody>
                        </Table>
                    </Card.Body>






                    <Card.Footer>
                    <div style={{"float":"left"}}>
                                Showing Page {currentPage} of {totalPages}
                            </div>
                            <div style={{"float":"right"}}>
                                <InputGroup size="sm">
                                    <InputGroup.Prepend>
                                        <Button type="button" variant="outline-info" disabled={currentPage === 1 ? true : false}
                                            onClick={ this.firstPage } >
                                            <FontAwesomeIcon icon={faFastBackward} /> First
                                        </Button>
                                        <Button type="button" variant="outline-info" disabled={currentPage === 1 ? true : false}
                                            onClick={ this.prevPage}>
                                            <FontAwesomeIcon icon={faStepBackward} /> Prev
                                        </Button>
                                    </InputGroup.Prepend>
                                    <FormControl className={"bg-dark"} name="currentPage" value={currentPage}
                                        onChange={ () => this.changePage} />
                                    <InputGroup.Append>
                                        <Button type="button" variant="outline-info" disabled={currentPage === totalPages ? true : false}
                                            onClick={ this.nextPage}>
                                            <FontAwesomeIcon icon={faStepForward} /> Next
                                        </Button>
                                        <Button type="button" variant="outline-info" disabled={currentPage === totalPages ? true : false}
                                            onClick={ this.lastPage}>
                                            <FontAwesomeIcon icon={faFastForward} /> Last
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </div>
                    </Card.Footer>
            </Card>


            <Modal size="lg" centered show={ this.state.shoppingCartVisible } onHide={ () => this.setStateShoppingCartVisible(false) }>
                
                <Modal.Header closeButton>
                        <strong>
                        <FontAwesomeIcon icon={ faShoppingBag } size="lg" color="#149dff"></FontAwesomeIcon> List of ordered products
                        </strong>
                </Modal.Header>

                <Modal.Body>
                    <Table hover size="sm">
                        <thead className="thead">
                        <tr>
                            <th className="th">Image</th>
                            <th className="th">Product</th>
                            <th className="th">Category</th>
                            <th className="th">Quantity</th>
                            <th className="th">Price of one product</th>
                            <th className="th">Total price</th>
                        </tr>
                        </thead>
                        <tbody>
                            { this.state.shoppingCart?.productShoppingCarts.map(productShoppingCart => {
                            
                            /*const articlePrice = this.getLatestPriceBeforeDate(item.article, this.state.cart?.createdAt);

                            const price = Number(articlePrice.price).toFixed(2);
                            const total = Number(articlePrice.price * item.quantity).toFixed(2);*/

                            return (
                                <tr className="active">
                                <img src= { productShoppingCart.product.images[productShoppingCart.product.images?.length-1].imagePath } alt="" width="95px"></img>
                                            
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
                </Modal.Body>
            </Modal>
        </Container>
        )
    }

    private showTheRequestedCart(cart: ShoppingCartType) {
        this.setShoppingCartState(cart);
        this.showShoppingCart();
    }

    private printSingleOrder(order: OrderType) {
        return (
            <tr key={ order.orderId }>
                <td> { new Date(order.createdAt).getDate() } { monthNames[new Date(order.createdAt).getMonth()] } { new Date(order.createdAt).getFullYear() } { (new Date(order.createdAt).getHours()<10?'0':'') +  new Date(order.createdAt).getHours()}:{ (new Date(order.createdAt).getMinutes()<10?'0':'') + new Date(order.createdAt).getMinutes() }:{ (new Date(order.createdAt).getSeconds()<10?'0':'') + new Date(order.createdAt).getSeconds()} </td>
                <td>{ order.orderStatus }</td>
                <td>
                <Button size="sm" className = "infoButton"
                            onClick={ () => this.showTheRequestedCart(order.cart) }>
                        <FontAwesomeIcon size="lg" icon={ faInfo }/>
                </Button>
                </td>
            </tr>
        );
    }

    private printSingleOrde(order: OrderType) {
        const {customerOrders, currentPage, ordersPerPage} = this.state;
        const lastIndex = currentPage * ordersPerPage;
        const firstIndex = lastIndex - ordersPerPage;
        const currentOrders = customerOrders.slice(firstIndex, lastIndex);
    
        return (
        <Table>
        <tbody>
        {   this.state.customerOrders.length === 0 ?
                                    <tr>
                                      <td>No Orders Available.</td>
                                    </tr> :
                                    currentOrders.map((currentOrder, orderId ) => (
            <tr key={ currentOrder.orderId }>
                <td> { new Date(currentOrder.createdAt).getDate() } { monthNames[new Date(currentOrder.createdAt).getMonth()] } { new Date(currentOrder.createdAt).getFullYear() } { (new Date(currentOrder.createdAt).getHours()<10?'0':'') +  new Date(currentOrder.createdAt).getHours()}:{ (new Date(currentOrder.createdAt).getMinutes()<10?'0':'') + new Date(currentOrder.createdAt).getMinutes() }:{ (new Date(currentOrder.createdAt).getSeconds()<10?'0':'') + new Date(currentOrder.createdAt).getSeconds()} </td>
                <td>{ currentOrder.orderStatus }</td>
                <td>
                <Button size="sm" className = "infoButton"
                            onClick={ () => this.showTheRequestedCart(order.cart) }>
                        <FontAwesomeIcon size="lg" icon={ faInfo }/>
                </Button>
                </td>
            </tr>
                        ))
        }
        </tbody>
        </Table>
        );
    }

    private print(order: OrderType) {
        const {customerOrders, currentPage, ordersPerPage} = this.state;
        const lastIndex = currentPage * ordersPerPage;
        const firstIndex = lastIndex - ordersPerPage;
        const currentOrders = customerOrders.slice(firstIndex, lastIndex);
    
        return (
        <Table>
        <tbody>
        {   this.state.customerOrders.length === 0 ?
                                    <tr>
                                      <td>No Orders Available.</td>
                                    </tr> :
                                    currentOrders.map((currentOrder, index) => (
            <tr>
                <td key = {index}> { new Date(currentOrder.createdAt).getDate() } { monthNames[new Date(currentOrder.createdAt).getMonth()] } { new Date(currentOrder.createdAt).getFullYear() } { (new Date(currentOrder.createdAt).getHours()<10?'0':'') +  new Date(currentOrder.createdAt).getHours()}:{ (new Date(currentOrder.createdAt).getMinutes()<10?'0':'') + new Date(currentOrder.createdAt).getMinutes() }:{ (new Date(currentOrder.createdAt).getSeconds()<10?'0':'') + new Date(currentOrder.createdAt).getSeconds()} </td>
                <td>{ currentOrder.orderStatus }</td>
                <td>
                
                <Button size="sm" className = "infoButton"
                            onClick={ () => this.showTheRequestedCart(order.cart) }>
                        <FontAwesomeIcon size="lg" icon={ faInfo }/>
                </Button>
                </td>
            </tr>
                        ))
                    
        }
        </tbody>
        </Table>
        );
    }

}