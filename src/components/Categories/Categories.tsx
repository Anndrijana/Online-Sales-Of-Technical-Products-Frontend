import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CategoryType from '../../types/CategoryType';
import { Redirect, Link  } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import CategoryDto from '../../dtos/CategoryDto';
import RoledNavbar from '../RoledNavbar/RoledNavbar';

interface CategoriesState {
    isUserLoggedIn: boolean;
    categories?: CategoryType[];
}

class Categories extends React.Component {
    state: CategoriesState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            categories: [],
        };
    }

    componentDidMount() {
        this.getCategories();
    }

    componentDidUpdate() {
        this.getCategories();
    }

    private getCategories() {
        api('api/category/?filter=parentCategoryId||$isnull', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }

            this.putCategoriesInState(res.data);
        });
    }

    private putCategoriesInState(data?: CategoryDto[]) {
        const categories: CategoryType[] | undefined = data?.map(category => {
            return {
                categoryId: category.categoryId,
                categoryName: category.categoryName,
                imagePath: category.imagePath,
            };
        });

        const newState = Object.assign(this.state, {
            categories: categories,
        });

        this.setState(newState);
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
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
                <RoledNavbar role="customer"></RoledNavbar>
                
                <Card className="p">
                    <Card.Body>
                        <Card.Title className="p">
                            <FontAwesomeIcon icon={ faListAlt } color="#C62E65"/> List of all major categories
                        </Card.Title>

                        <Row>
                            { this.state.categories?.map(this.singleCategory) }
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private singleCategory(category: CategoryType) {
        return (
            <Col lg="3" md="3" sm="6" xs="12" key={ category.categoryId }>
                <Card className="mb-3">
                <Card.Img variant="top" src={ category.imagePath } width="300" height="170"/>
                    <Card.Body>
                        <Card.Title as="p" className="cTitle">
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
}

export default Categories;
