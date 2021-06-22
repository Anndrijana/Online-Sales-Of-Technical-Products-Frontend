import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit, faSave, faImages } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse, apiFile } from '../../api/api';
import ProductType from '../../types/ProductType';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/CategoryDto';
import ApiProductDto from '../../dtos/ProductDto';
import RoledNavbar from '../RoledNavbar/RoledNavbar';


interface AdministratorProductState {
    isAdministratorLoggedIn: boolean;
    products: ProductType[];
    categories: CategoryType[];
    status: string[];

    addModal: {
        visible: boolean;
        message: string;
        
        productName: string;
        categoryId: number;
        shortDesc: string;
        detailedDesc: string;
        price: number;
        productAmount: number;
    };

    editModal: {
        visible: boolean;
        message: string;

        productId?: number;
        productName: string;
        categoryId: number;
        shortDesc: string;
        detailedDesc: string;
        productStatus: string;
        isPromoted: number;
        price: number;
        productAmount: number;
    };
}

class AdministratorProducts extends React.Component {
    state: AdministratorProductState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            products: [],
            categories: [],
            status: [
                "available",
                "visible",
                "hidden",
            ],

            addModal: {
                visible: false,
                message: '',

                productName: '',
                categoryId: 1,
                shortDesc: '',
                detailedDesc: '',
                price: 0.01,
                productAmount: 0
            },

            editModal: {
                visible: false,
                message: '',

                productName: '',
                categoryId: 1,
                shortDesc: '',
                detailedDesc: '',
                productStatus: 'available',
                isPromoted: 0,
                price: 0.01,
                productAmount: 0,
            },
        };
    }

    private setAddModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                visible: newState,
            })
        ));
    }

    private setAddModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [ fieldName ]: newValue,
            })
        ));
    }
    
    private setAddModalNumberFieldState(fieldName: string, newValue: any) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
            })
        ));
    }

    private setEditModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                visible: newState,
            })
        ));
    }

    private setEditModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [ fieldName ]: newValue,
            })
        ));
    }
    
    private setEditModalNumberFieldState(fieldName: string, newValue: any) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
            })
        ));
    }

    componentDidMount() {
        this.getCategories();
        this.getProducts();
    }

    private getCategories() {
        api('/api/category/', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }

            this.putCategoriesInState(res.data);
        });
    }

    private putCategoriesInState(data?: ApiCategoryDto[]) {
        const categories: CategoryType[] | undefined = data?.map(category => {
            return {
                categoryId: category.categoryId,
                categoryName: category.categoryName,
                imagePath: category.imagePath,
                parentCategoryId: category.parentCategoryId,
            };
        });

        this.setState(Object.assign(this.state, {
            categories: categories,
        }));
    }

    private getProducts() {
        api('/api/product/?join=prices&join=images&join=category', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }

            this.putProductsInState(res.data);
        });
    }

    private putProductsInState(data?: ApiProductDto[]) {
        const products: ProductType[] | undefined = data?.map(product => {
            return {
                productId: product.productId,
                productName: product.productName,
                shortDesc: product.shortDesc,
                detailedDesc: product.detailedDesc,
                productAmount: product.productAmount,
                /*imagePath: product.images[0].imagePath,*/
                price: product.prices[product.prices.length-1].price,
                productStatus: product.productStatus,
                isPromoted: product.isPromoted,
                prices: product.prices,
                images: product.images,
                category: product.category,
                categoryId: product.categoryId,
            };
        });

        this.setState(Object.assign(this.state, {
            products: products,
        }));
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
    }

    private async addModalCategoryChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setAddModalNumberFieldState('categoryId', event.target.value);
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
                            <FontAwesomeIcon icon={ faListAlt } /> Products
                        </Card.Title>

                        <Table hover size="sm" bordered>
                            <thead>
                                <tr>
                                    <th colSpan={ 6 }></th>
                                    <th className="text-center">
                                        <Button variant="primary" size="sm"
                                            onClick={ () => this.showAddModal() }>
                                            <FontAwesomeIcon icon={ faPlus } /> Add
                                        </Button>
                                    </th>
                                </tr>
                                <tr>
                                    <th className="text-right">ID</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Promoted</th>
                                    <th className="text-right">Price</th>
                                    <th className="text-right">Amount</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.products.map(product => (
                                    <tr>
                                        <td className="text-right">{ product.productId }</td>
                                        <td>{ product.productName }</td>
                                        <td>{ product.category?.categoryName }</td>
                                        <td>{ product.productStatus }</td>
                                        <td>{ product.isPromoted ? 'Yes' : 'No' }</td>
                                        <td className="text-right">{ product.price }</td>
                                        <td className="text-right">{ product.productAmount }</td>
                                        <td className="text-center">
                                            <Link to={ "/admin/home/image/" + product.productId }
                                                  className="btn btn-sm btn-info mr-3">
                                                <FontAwesomeIcon icon={ faImages } /> Images
                                            </Link>

                                            <Button variant="info" size="sm"
                                                onClick={ () => this.showEditModal(product) }>
                                                <FontAwesomeIcon icon={ faEdit } /> Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ), this) }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal size="lg" centered show={ this.state.addModal.visible }
                       onHide={ () => this.setAddModalVisibleState(false) }
                       onEntered={ () => {
                            if (document.getElementById('add-photo')) {
                                const filePicker: any = document.getElementById('add-photo');
                                filePicker.value = '';
                            }
                        } }>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="add-categoryId">Category</Form.Label>
                            <Form.Control id="add-categoryId" as="select" value={ this.state.addModal.categoryId.toString() }
                                onChange={ (e) => this.addModalCategoryChanged(e as any) }>
                                { this.state.categories.map(category => (
                                    <option value={ category.categoryId?.toString() }>
                                        { category.categoryName }
                                    </option>
                                )) }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-productName">Name</Form.Label>
                            <Form.Control id="add-productName" type="text" value={ this.state.addModal.productName }
                                onChange={ (e) => this.setAddModalStringFieldState('productName', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-shortDesc">Short text</Form.Label>
                            <Form.Control id="add-shortDesc" type="text" value={ this.state.addModal.shortDesc }
                                onChange={ (e) => this.setAddModalStringFieldState('shortDesc', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-detailedDesc">Detailed text</Form.Label>
                            <Form.Control id="add-detailedDesc" as="textarea" value={ this.state.addModal.detailedDesc }
                                onChange={ (e) => this.setAddModalStringFieldState('detailedDesc', e.target.value) }
                                rows={ 10 } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-price">Price</Form.Label>
                            <Form.Control id="add-price" type="number" min={ 0.01 } step={ 0.01 } value={ this.state.addModal.price }
                                onChange={ (e) => this.setAddModalNumberFieldState('price', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-productAmount">Product amount</Form.Label>
                            <Form.Control id="add-productAmount" type="number" min={ 0 } step={ 1 } value={ this.state.addModal.productAmount }
                                onChange={ (e) => this.setAddModalNumberFieldState('productAmount', e.target.value) } />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="add-photo">Product photo</Form.Label>
                            <Form.File id="add-photo" />
                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" onClick={ () => this.doAddProduct() }>
                                <FontAwesomeIcon icon={ faPlus } /> Add new product
                            </Button>
                        </Form.Group>
                        { this.state.addModal.message ? (
                            <Alert variant="danger" value={ this.state.addModal.message } />
                        ) : '' }
                    </Modal.Body>
                </Modal>

                <Modal size="lg" centered show={ this.state.editModal.visible }
                       onHide={ () => this.setEditModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="edit-productName">Name</Form.Label>
                            <Form.Control id="edit-productName" type="text" value={ this.state.editModal.productName }
                                onChange={ (e) => this.setEditModalStringFieldState('productName', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-shortDesc">Short text</Form.Label>
                            <Form.Control id="edit-shortDesc" type="text" value={ this.state.editModal.shortDesc }
                                onChange={ (e) => this.setEditModalStringFieldState('shortDesc', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-detailedDesc">Detailed text</Form.Label>
                            <Form.Control id="edit-detailedDesc" as="textarea" value={ this.state.editModal.detailedDesc }
                                onChange={ (e) => this.setEditModalStringFieldState('detailedDesc', e.target.value) }
                                rows={ 10 } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-productStatus">Status</Form.Label>
                            <Form.Control id="edit-productStatus" as="select" value={ this.state.editModal.productStatus.toString() }
                                onChange={ (e) => this.setEditModalStringFieldState('productStatus', e.target.value) }>
                                <option value="available">Available</option>
                                <option value="visible">Visible</option>
                                <option value="hidden">Hidden</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-isPromoted">Promoted</Form.Label>
                            <Form.Control id="edit-isPromoted" as="select" value={ this.state.editModal.isPromoted.toString() }
                                onChange={ (e) => this.setEditModalNumberFieldState('isPromoted', e.target.value) }>
                                <option value="0">Not promoted</option>
                                <option value="1">Is promoted</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-price">Price</Form.Label>
                            <Form.Control id="edit-price" type="number" min={ 0.01 } step={ 0.01 } value={ this.state.editModal.price }
                                onChange={ (e) => this.setEditModalNumberFieldState('price', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-productAmount">Product amount</Form.Label>
                            <Form.Control id="edit-productAmount" type="number" min={ 0 } step={ 1 } value={ this.state.editModal.productAmount }
                                onChange={ (e) => this.setEditModalNumberFieldState('productAmount', e.target.value) } />
                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" onClick={ () => this.doEditProduct() }>
                                <FontAwesomeIcon icon={ faSave } /> Edit product
                            </Button>
                        </Form.Group>
                        { this.state.editModal.message ? (
                            <Alert variant="danger" value={ this.state.editModal.message } />
                        ) : '' }
                    </Modal.Body>
                </Modal>
            </Container>
        );
    }

    private showAddModal() {
        this.setAddModalStringFieldState('message', '');

        this.setAddModalStringFieldState('name', '');
        this.setAddModalStringFieldState('shortDescription', '');
        this.setAddModalStringFieldState('detailedDescription', '');
        this.setAddModalNumberFieldState('categoryId', '1');
        this.setAddModalNumberFieldState('price', '0.01');
        this.setAddModalNumberFieldState('productAmount', '0');

        this.setAddModalVisibleState(true);
    }

    private doAddProduct() {
        const filePicker: any = document.getElementById('add-photo');

        if (filePicker?.files.length === 0) {
            this.setAddModalStringFieldState('message', 'You must select a file to upload!');
            return;
        }

        api('/api/product/', 'post', {
            categoryId: this.state.addModal.categoryId,
            productName: this.state.addModal.productName,
            shortDesc: this.state.addModal.shortDesc,
            detailedDesc: this.state.addModal.detailedDesc,
            price: this.state.addModal.price,
            productAmount: this.state.addModal.productAmount,
        }, 'administrator')
        .then(async (res: ApiResponse) => {
            if (res.status === "login") {
                this.setLogginState(false);
                return;
            }

            if (res.status === "error") {
                this.setAddModalStringFieldState('message', JSON.stringify(res.data));
                return;
            }

            const productId: number = res.data.productId;

            const file = filePicker.files[0];
            await this.uploadProductPhoto(productId, file);

            this.setAddModalVisibleState(false);
            this.getProducts();
        });
    }

    private async uploadProductPhoto(productId: number, file: File) {
        return await apiFile('/api/product/' + productId + '/uploadImage/', 'image', file, 'administrator');
    }

    private async showEditModal(product: ProductType) {
        this.setEditModalStringFieldState('message', '');
        this.setEditModalNumberFieldState('productId', product.productId);
        this.setEditModalStringFieldState('productName', String(product.productName));
        this.setEditModalStringFieldState('shortDesc', String(product.shortDesc));
        this.setEditModalStringFieldState('detailedDesc', String(product.detailedDesc));
        this.setEditModalStringFieldState('productStatus', String(product.productStatus));
        this.setEditModalNumberFieldState('price', product.price);
        this.setEditModalNumberFieldState('isPromoted', product.isPromoted);
        this.setEditModalNumberFieldState('productAmount', product.productAmount);

        if (!product.category?.categoryId) {
            return;
        }

        this.setEditModalVisibleState(true);
    }

    private doEditProduct() {
        api('/api/product/' + this.state.editModal.productId, 'patch', {
            productName: this.state.editModal.productName,
            shortDesc: this.state.editModal.shortDesc,
            detailedDesc: this.state.editModal.detailedDesc,
            price: this.state.editModal.price,
            productStatus: this.state.editModal.productStatus,
            isPromoted: this.state.editModal.isPromoted,
            productAmount: this.state.editModal.productAmount,
        }, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "login") {
                this.setLogginState(false);
                return;
            }

            if (res.status === "error") {
                this.setAddModalStringFieldState('message', JSON.stringify(res.data));
                return;
            }

            this.setEditModalVisibleState(false);
            this.getProducts();
        });
    }
}

export default AdministratorProducts;