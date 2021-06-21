import React from "react";
import { Card, Col } from "react-bootstrap";
import ProductType from "../../types/ProductType";

interface SingleProductProp {
    product: ProductType,
}

export default class SingleProductForVisitors extends React.Component<SingleProductProp> {


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
                    
                    
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}