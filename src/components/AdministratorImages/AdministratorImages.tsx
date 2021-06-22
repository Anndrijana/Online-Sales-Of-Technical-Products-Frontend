import React from 'react';
import { Container, Card, Row, Col, Button, Form, Nav } from 'react-bootstrap';
import { faImages, faMinus, faPlus, faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse, apiFile } from '../../api/api';
import ImageType from '../../types/ImageType';
import RoledNavbar from '../RoledNavbar/RoledNavbar';
import { ApiConfig } from '../../config/api.config';


interface AdministratorImagesProp {
    match: {
        params: {
            id: number;
        }
    }
}

interface AdministratorImagesState {
    isAdministratorLoggedIn: boolean;
    images: ImageType[];
}

class AdministratorImages extends React.Component<AdministratorImagesProp> {
    state: AdministratorImagesState;

    constructor(props: Readonly<AdministratorImagesProp>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            images: [],
        };
    }

    componentDidMount() {
        this.getImages();
    }

    componentDidUpdate(oldProps: any) {
        if (this.props.match.params.id === oldProps.match.params.id) {
            return;
        }

        this.getImages();
    }

    private getImages() {
        api('/api/product/' + this.props.match.params.id + '/?join=images', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }

            this.setState(Object.assign(this.state, {
                images: res.data.images,
            }));
        });
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
    }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/admin/login" />
            );
        }

        return (
            <Container>
                <RoledNavbar role="administrator" />

                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faImages } /> Images
                        </Card.Title>

                        <Nav className="mb-3">
                            <Nav.Item>
                                <Link to="/admin/home/product/" className="btn btn-sm btn-info">
                                    <FontAwesomeIcon icon={ faBackward } /> Go back to articles
                                </Link>
                            </Nav.Item>
                        </Nav>

                        <Row>
                            { this.state.images.map(this.printSingleImage, this) }
                        </Row>

                        <Form className="mt-5">
                            <p>
                                <strong>Add a new image to this product</strong>
                            </p>
                            <Form.Group>
                                <Form.Label htmlFor="add-image">New product image</Form.Label>
                                <Form.File id="add-image" />
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary"
                                        onClick={ () => this.doUpload() }>
                                    <FontAwesomeIcon icon={ faPlus } /> Upload image
                                </Button>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private printSingleImage(image: ImageType) {
        return (
            <Col xs="12" sm="6" md="4" lg="3">
                <Card>
                    <Card.Body>
                        <img alt=""
                             src= { ApiConfig.IMAGE_PATH + image.imagePath }
                             className="w-100" width="100px"/> 
                        
                        <img alt=""
                             src= { image.imagePath }
                             className="w-100" width="100px"/>
                    </Card.Body>
                    <Card.Footer>
                        { this.state.images.length > 1 ? (
                            <Button variant="danger" block
                                onClick={ () => this.deleteImage(image.imageId) }>
                                <FontAwesomeIcon icon={ faMinus } /> Delete image
                            </Button>
                        ) : '' }
                    </Card.Footer>
                </Card>
            </Col>
        );
    }
    
    private async doUpload() {
        const filePicker: any = document.getElementById('add-image');

        if (filePicker?.files.length === 0) {
            return;
        }

        const file = filePicker.files[0];
        await this.uploadArticleImage(this.props.match.params.id, file);
        filePicker.value = '';

        this.getImages();
    }

    private async uploadArticleImage(productId: number, file: File) {
        return await apiFile('/api/product/' + productId + '/uploadImage/', 'image', file, 'administrator');
    }

    private deleteImage(imageId: number) {
        if (!window.confirm('Are you sure?')) {
            return;
        }

        api('/api/product/' + this.props.match.params.id + '/deleteImage/' + imageId + '/', 'delete', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }

            this.getImages();
        })
    }
}

export default AdministratorImages;