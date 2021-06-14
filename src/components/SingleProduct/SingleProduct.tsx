import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductType from "../../types/ProductType";
import api, { ApiResponse } from '../../api/api';

interface SingleProductProp {
    product: ProductType,
}

interface SingleProductState {
    count: number;
}

export default class SingleProduct extends React.Component<SingleProductProp> {
    state: SingleProductState
    
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: Readonly<SingleProductProp>) {
        super(props);

        this.state = {
            count: 1,
        }
    
    }

    private countChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            count: Number(event.target.value),
        })
    }

    private addToShoppingCart() {
        const data = {
            productId: this.props.product.productId,
            quantity: this.state.count,
        }

        api('/api/shoppingCart/addToShoppingCart', 'post', data)
        .then((res: ApiResponse) => {
            
            if (res.status === 'login') {
                return;
            }

            const event = new CustomEvent('shoppingCart.update');
            window.dispatchEvent(event);
        });

    }

    render() {
        return (
            <Col lg="3" key={ this.props.product.productId }>
               
                <Card className="mbb-3">
                    <Card.Header className="card-img">
                    <Card.Img variant="top" src={ this.props.product.imageUrl } width="300" height="170"/>
                    </Card.Header>
                
                    <Card.Body>
                        <Card.Title as="p" className="name">
                            { this.props.product.productName }
                        </Card.Title>
                        <Card.Text className="price">
                            { Number(this.props.product.price).toFixed(2) } EUR
                        </Card.Text>
                        <Link to={ `/product/${ this.props.product.productId }` }
                              className="btn btn-width">
                                See more
                        </Link>
                        <Form.Group>
                            <Row>
                                <Col xs="6">
                                    <Form.Control className="count-product" type="number" min="1" step="1" value= { this.state.count }
                                    onChange={(e) => this.countChanged(e as any)}></Form.Control>
                                </Col>
                                <Col xs="6">
                                    <Button className="btn-cart" onClick={ () => this.addToShoppingCart() }>BUY</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}