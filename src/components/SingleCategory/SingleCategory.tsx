import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import api, { ApiResponse } from '../../api/api';
import CategoryType from "../../types/CategoryType";
import ProductType from "../../types/ProductType";
import { Link, Redirect } from 'react-router-dom';
import CategoryDto from '../../dtos/CategoryDto';
import ProductDto from "../../dtos/ProductDto";

interface CategoryProp {
    match: {
        params: {
            id: number;
        }
    }

}

interface CategoryState {
    isUserLoggedIn: boolean;
    category?: CategoryType;
    subcategories?: CategoryType[];
    products?: ProductType[];
}

export default class SingleCategory extends React.Component<CategoryProp> {
    state: CategoryState;

    constructor(props: Readonly<CategoryProp>) {
        super(props);
        
        this.state = {
            isUserLoggedIn: true,
        }
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
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
        if (this.state.isUserLoggedIn === false) {
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
                        { this.showProducts() }
                    </Card.Body>
                   
                </Card>
             
            </Container>
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
    
        return (
            <Row>
                { this.state.products?.map(this.singleProduct) }
            </Row>
        );
    }

   private singleProduct(product: ProductType) {
        return (
            <Col lg="3" md="6" sm="6" xs="12" key={ product.productId }>
                <Card className="mb-3">
                    <Card.Header>
                    <Card.Img variant="top" src={ product.imageUrl } width="300" height="170"/>
                    </Card.Header>
                
                    <Card.Body>
                        <Card.Title as="p">
                            { product.shortDesc }
                        </Card.Title>
                        <Card.Text>
                            Price: { Number(product.price).toFixed(2) } EUR
                        </Card.Text>
                        <Link to={ `/product/${ product.productId }` }
                              className="btn">
                            Open
                        </Link>
                    </Card.Body>
                </Card>
            </Col>
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

        api('api/product/search/', 'post', {
            categoryId: Number(this.props.match.params.id),
            keywords: "",
            priceMin: 0,
            priceMax: Number.MAX_SAFE_INTEGER,
            features: [ ],
            orderBy: "price",
            orderDirection: "ASC",
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