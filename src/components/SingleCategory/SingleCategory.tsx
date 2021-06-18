import React from "react";
import { Card, Col, Container, Form, Row, Button } from "react-bootstrap";
import api, { ApiResponse } from '../../api/api';
import CategoryType from "../../types/CategoryType";
import ProductType from "../../types/ProductType";
import { Link, Redirect } from 'react-router-dom';
import CategoryDto from '../../dtos/CategoryDto';
import ProductDto from "../../dtos/ProductDto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchMinus } from "@fortawesome/free-solid-svg-icons";
import SingleProduct from "../SingleProduct/SingleProduct";

interface CategoryProp {
    match: {
        params: {
            id: number;
        }
    }

}

interface CategoryState {
    isCustomerLoggedIn: boolean;
    category?: CategoryType;
    subcategories?: CategoryType[];
    products?: ProductType[];
    filters: {
        keywords: string;
        priceMin: number;
        priceMax: number;
        order: "name asc" | "name desc" | "price asc" | "price desc";
    };
}

export default class SingleCategory extends React.Component<CategoryProp> {
    state: CategoryState;

    constructor(props: Readonly<CategoryProp>) {
        super(props);
        
        this.state = {
            isCustomerLoggedIn: true,
            filters: {
                keywords: '',
                priceMin: 0,
                priceMax: 100000,
                order: "price asc",
            }
        }
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isCustomerLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private setSingleCategory(category: CategoryType) {
        const newState = Object.assign(this.state, {
            category: category,
        });

        this.setState(newState);
    }

    private setSubcategories(subcategories: CategoryType[]) {
        const newState = Object.assign(this.state, {
            subcategories: subcategories,
        });

        this.setState(newState);
    }

    private setProducts(products: ProductType[]) {
        const newState = Object.assign(this.state, {
            products: products,
        });

        this.setState(newState);
    }

    render() {
        if (this.state.isCustomerLoggedIn === false) {
            return (
                <Redirect to="/customer/login" />
            );
        }

        return (
            <Container>
                <Card className="p">
                    <Card.Body>
                        <Card.Title className="p">
                            { this.state.category?.categoryName }
                        </Card.Title>
                            {  this.showSubcategories() }
                        <Row>
                        
                        <Col lg="9">
                            { this.showProducts() }
                        </Col>
                            
                        </Row>
                        
                    </Card.Body>
                   
                </Card>
             
            </Container>
        );
    }

    private setNewFilter(newFilter: any) {
        this.setState(Object.assign(this.state, {
            filter: newFilter,
        }));
    }

    private keywordsFilterChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            keywords: event.target.value,
        }));
    }

    private priceMinFilterChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            priceMin: Number(event.target.value),
        }));
    }

    private priceMaxFilterChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            priceMax: Number(event.target.value),
        }));
    }

    private OrderFilterChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            order: event.target.value,
        }));
    }

    private applyFilters() {
        this.getCategoryData();
    }

    private filters() {
        return (
            <>
            <Card className="filters">
            
            <Form.Group>
                    <Form.Control className="fccc" as="select" id="sortOrder"
                                  value={ this.state.filters.order }
                                  onChange={ (e) => this.OrderFilterChanged(e as any) }>
                        <option value="name asc">Sort ascending by name</option>
                        <option value="name desc">Sort descending by name</option>
                        <option value="price asc">Sort ascending by price</option>
                        <option value="price desc">Sort descending by price</option>
                    </Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Control className="fcc" type="text"  id="keywords" placeholder="Search keywords"
                value={ this.state.filters.keywords }
                onChange= {(e) => this.keywordsFilterChanged(e as any)}></Form.Control>
            </Form.Group>

            <Form.Group>
                    <Row>
                        <Col xs="12" sm="6" lg="6">
                            <Form.Label className="l" htmlFor="priceMin">Minimum price:</Form.Label>
                            <Form.Control className="fc" type="number" id="priceMin"
                                          step="0.01" min="0.01" max="99999.99"
                                          value={ this.state.filters.priceMin }
                                          onChange={ (e) => this.priceMinFilterChanged(e as any) } />
                        </Col>
                        <Col xs="12" sm="6" lg="6">
                        <Form.Label className="l" htmlFor="priceMax">Maximum price:</Form.Label>
                            <Form.Control className="fc" type="number" id="priceMax"
                                          step="0.01" min="0.02" max="100000"
                                          value={ this.state.filters.priceMax }
                                          onChange={ (e) => this.priceMaxFilterChanged(e as any) } />
                        </Col>
                    </Row>
            </Form.Group>

            <Form.Group>
                    <Button className="btn" block onClick={ () => this.applyFilters() }>
                        <FontAwesomeIcon icon={ faSearchMinus } /> 
                    </Button>
            </Form.Group>
            </Card>
                
            </>
        );
    }

    private showSubcategories() {
        if (this.state.subcategories?.length === 0) {
            return;
        }

        return (
            <Row>
                { this.state.subcategories?.map(this.singleSubcategory) }
            </Row>
        );
    }

    private singleSubcategory(category: CategoryType) {
        return (
            <Col lg="3" md="4" sm="6" xs="12" key={ category.categoryId }>
                <Card className="mb-3">
                <Card.Img variant="top" src={ category.imagePath } width="300" height="170"/>
                    <Card.Body>
                        <Card.Title as="p">
                            { category.categoryName }
                        </Card.Title>
                        <Link to={ `/category/${ category.categoryId }` }
                              className="btn">
                            Open
                        </Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }

   private showProducts() {

    if (this.state.products?.length !== 0) {
        return (
            <Container>
            
            <Card className="width">
            <Row>
            

            <Col lg="3">
                { this.filters() }
            </Col>
            

           
                { this.state.products?.map(this.singleProduct) }
            
           
            </Row>

            </Card>

            </Container>
        );
    }
}

   private singleProduct(product: ProductType) {
       return (
           <SingleProduct product={product}></SingleProduct>
       );
    }

    componentDidMount() {
       this.getCategoryData();
    }

    componentDidUpdate(oldProp: CategoryProp) {
        if (oldProp.match.params.id === this.props.match.params.id) {
            return;
        }

        this.getCategoryData();
    }

    private getCategoryData() {
        api('api/category/' + this.props.match.params.id, 'get', {})
        .then((res:ApiResponse) => {
           if(res.status === 'login') {
               return this.setLogginState(false);
           }

           const singleCategory: CategoryType = {
               categoryId: res.data.categoryId,
               categoryName: res.data.categoryName,
           };

           this.setSingleCategory(singleCategory);

           const subcategories: CategoryType[] = res.data.categories.map((category: CategoryDto) => {
                return {
                categoryId: category.categoryId,
                categoryName: category.categoryName,
                imagePath: category.imagePath,
                }
           });

           this.setSubcategories(subcategories);
        });

        const orderParts = this.state.filters.order.split(' ');

        api('api/product/search/', 'post', {
            categoryId: Number(this.props.match.params.id),
            keywords: this.state.filters.keywords,
            priceMin: this.state.filters.priceMin,
            priceMax: this.state.filters.priceMax,
            features: [ ],
            orderBy: orderParts[0],
            orderDirection: orderParts[1].toUpperCase(),
        })

        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLogginState(false);
            }

            if (res.data.statusCode === 0) {
                this.setProducts([]);
                return;
            }

            const products: ProductType[] =
            res.data.map((product: ProductDto) => {
                const object: ProductType = {
                    productId: product.productId,
                    productName: product.productName,
                    shortDesc: product.shortDesc,
                    detailedDesc: product.detailedDesc,
                    price: 0,
                    imageUrl: '',
                };

                if (product.images !== undefined && product.images?.length > 0) {
                    object.imageUrl = product.images[product.images?.length-1].imagePath;
                }

                if (product.prices !== undefined && product.prices?.length > 0) {
                    object.price = product.prices[product.prices?.length-1].price;
                }

                return object;
            });

            this.setProducts(products);
        });
    }
}