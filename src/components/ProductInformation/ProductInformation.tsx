import React from 'react';
import api, { ApiResponse } from '../../api/api';
import { Redirect } from 'react-router-dom';
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import ApiProductDto from '../../dtos/ProductDto';
import ProductType from '../../types/ProductType';
import RoledNavbar from '../RoledNavbar/RoledNavbar';

interface AddToShoppingCartInputProp {
    product: ProductType,
}

interface AddToSghoppingCartInputState {
    quantity: number;
}

class AddToCartInput extends React.Component<AddToShoppingCartInputProp> {
    state: AddToSghoppingCartInputState;

    constructor(props: Readonly<AddToShoppingCartInputProp>) {
        super(props);

        this.state = {
            quantity: 1,
        }
    }

    private quantityChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            quantity: Number(event.target.value),
        });
    }

    private addToShoppingCart() {
        const data = {
            productId: this.props.product.productId,
            quantity: this.state.quantity,
        };

        api('/api/shoppingCart/addToShoppingCart/', 'post', data)
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                return;
            }

            window.dispatchEvent(new CustomEvent('cart.update'));
        });
    }

    render() {
        return (
            <Form.Group>
                <Row>
                    <Col xs="7">
                        <Form.Control type="number" min="1" step="1" value={ this.state.quantity }
                                        onChange={ (e) => this.quantityChanged(e as any) } />
                    </Col>
                    <Col xs="5">
                        <Button variant="secondary" block
                                onClick={ () => this.addToShoppingCart() }>
                            Buy
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
        );
    }
}


interface ProductProp {
    match: {
        params: {
            id: number;
        }
    }
}

interface ProdutInformationState {
    isUserLoggedIn: boolean;
    message: string;
    product?: ApiProductDto;
}

export default class ProductInformation extends React.Component<ProductProp> {
    state: ProdutInformationState;

    constructor(props: Readonly<ProductProp>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            message: '',
        };
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private setMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message,
        });

        this.setState(newState);
    }

    private setProductData(productData: ApiProductDto | undefined) {
        const newState = Object.assign(this.state, {
            product: productData,
        });

        this.setState(newState);
    }

    componentDidMount() {
        this.getProductData();
    }

    componentDidUpdate(oldProperties: ProductProp) {
        if (oldProperties.match.params.id === this.props.match.params.id) {
            return;
        }

        this.getProductData();
    }

    getProductData() {
        api('api/product/' + this.props.match.params.id, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLogginState(false);
            }

            if (res.status === 'error') {
                this.setProductData(undefined);
                this.setMessage('This product does not exist!');
                return;
            }

            const data: ApiProductDto = res.data;

            this.setMessage('');
            this.setProductData(data);

        });
    }

    private printOptionalMessage() {
        if (this.state.message === '') {
            return;
        }

        return (
            <Card.Text>
                { this.state.message }
            </Card.Text>
        );
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return (
                <Redirect to="/" />
            );
        }

        return (
            <Container>
                <RoledNavbar role="customer" />

                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faBoxOpen } /> {
                                this.state.product ?
                                this.state.product?.productName :
                                'Product not found'
                            }
                        </Card.Title>

                        { this.printOptionalMessage() }

                        {
                            this.state.product ?
                            ( this.renderProductData(this.state.product) ) :
                            ''
                        }
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    renderProductData(product: ApiProductDto) {
        return (
            <Row>
                <Col xs="12" lg="8">
                    <div className="excerpt">
                        { product.shortDesc }
                    </div>

                    <hr />
                    
                    <div className="description">
                        { product.detailedDesc }
                    </div>

                    <hr />

                </Col>

                <Col xs="12" lg="4">
                    <Row>
                        <Col xs="12" className="mb-3">
                            <img alt=""
                                    src={ product.images[0].imagePath }
                                    className="w-100" />
                        </Col>
                    </Row>

                    <Row>
                        { product.images.slice(1).map(image => (
                            <Col xs="12" sm="6">
                                <img alt=""
                                        src={ image.imagePath }
                                        className="w-100 mb-3" />
                            </Col>
                        ), this) }
                    </Row>

                    <Row>
                        <Col xs="12" className="text-center mb-3">
                            <b>
                                Price: { Number(product.prices[product.prices.length-1].price).toFixed(2) + ' EUR' }
                            </b>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs="12" className="mt-3">
                            <AddToCartInput product = { product } />
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}