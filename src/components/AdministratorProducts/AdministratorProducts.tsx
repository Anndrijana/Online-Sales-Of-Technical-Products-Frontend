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


interface AdministratorDashboardArticleState {
    isAdministratorLoggedIn: boolean;
    articles: ProductType[];
    categories: CategoryType[];
    status: string[];

    addModal: {
        visible: boolean;
        message: string;
        
        name: string;
        categoryId: number;
        excerpt: string;
        description: string;
        price: number;
    };

    editModal: {
        visible: boolean;
        message: string;

        articleId?: number;
        name: string;
        categoryId: number;
        excerpt: string;
        description: string;
        status: string;
        isPromoted: number;
        price: number;
    };
}

class AdministratorProducts extends React.Component {
    state: AdministratorDashboardArticleState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            articles: [],
            categories: [],
            status: [
                "available",
                "visible",
                "hidden",
            ],

            addModal: {
                visible: false,
                message: '',

                name: '',
                categoryId: 1,
                excerpt: '',
                description: '',
                price: 0.01,
            },

            editModal: {
                visible: false,
                message: '',

                name: '',
                categoryId: 1,
                excerpt: '',
                description: '',
                status: 'available',
                isPromoted: 0,
                price: 0.01,
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
        this.getArticles();
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
                name: category.categoryName,
                imagePath: category.imagePath,
                parentCategoryId: category.parentCategoryId,
            };
        });

        this.setState(Object.assign(this.state, {
            categories: categories,
        }));
    }

    private getArticles() {
        api('/api/article/?join=articlePrices&join=photos&join=category', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }

            this.putArticlesInState(res.data);
        });
    }

    private putArticlesInState(data?: ApiProductDto[]) {
        const articles: ProductType[] | undefined = data?.map(article => {
            return {
                articleId: article.productId,
                name: article.productName,
                excerpt: article.shortDesc,
                description: article.detailedDesc,
                imageUrl: article.images[0].imagePath,
                price: article.prices[article.prices.length-1].price,
                status: article.productStatus,
                isPromoted: article.isPromoted,
                articlePrices: article.prices,
                photos: article.images,
                category: article.category,
                categoryId: article.categoryId,
            };
        });

        this.setState(Object.assign(this.state, {
            articles: articles,
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
                            <FontAwesomeIcon icon={ faListAlt } /> Articles
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
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.articles.map(article => (
                                    <tr>
                                        <td className="text-right">{ article.productId }</td>
                                        <td>{ article.productName }</td>
                                        <td>{ article.category?.categoryName }</td>
                                        <td>{ article.productStatus }</td>
                                        <td>{ article.isPromoted ? 'Yes' : 'No' }</td>
                                        <td className="text-right">{ article.price }</td>
                                        <td className="text-center">
                                            <Link to={ "/administrator/dashboard/photo/" + article.productId }
                                                  className="btn btn-sm btn-info mr-3">
                                                <FontAwesomeIcon icon={ faImages } /> Photos
                                            </Link>

                                            <Button variant="info" size="sm"
                                                onClick={ () => this.showEditModal(article) }>
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
                        <Modal.Title>Add new article</Modal.Title>
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
                            <Form.Label htmlFor="add-name">Name</Form.Label>
                            <Form.Control id="add-name" type="text" value={ this.state.addModal.name }
                                onChange={ (e) => this.setAddModalStringFieldState('name', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-excerpt">Short text</Form.Label>
                            <Form.Control id="add-excerpt" type="text" value={ this.state.addModal.excerpt }
                                onChange={ (e) => this.setAddModalStringFieldState('excerpt', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-description">Detailed text</Form.Label>
                            <Form.Control id="add-description" as="textarea" value={ this.state.addModal.description }
                                onChange={ (e) => this.setAddModalStringFieldState('description', e.target.value) }
                                rows={ 10 } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-price">Price</Form.Label>
                            <Form.Control id="add-price" type="number" min={ 0.01 } step={ 0.01 } value={ this.state.addModal.price }
                                onChange={ (e) => this.setAddModalNumberFieldState('price', e.target.value) } />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="add-photo">Article photo</Form.Label>
                            <Form.File id="add-photo" />
                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" onClick={ () => this.doAddArticle() }>
                                <FontAwesomeIcon icon={ faPlus } /> Add new article
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
                        <Modal.Title>Edit article</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="edit-name">Name</Form.Label>
                            <Form.Control id="edit-name" type="text" value={ this.state.editModal.name }
                                onChange={ (e) => this.setEditModalStringFieldState('name', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-excerpt">Short text</Form.Label>
                            <Form.Control id="edit-excerpt" type="text" value={ this.state.editModal.excerpt }
                                onChange={ (e) => this.setEditModalStringFieldState('excerpt', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-description">Detailed text</Form.Label>
                            <Form.Control id="edit-description" as="textarea" value={ this.state.editModal.description }
                                onChange={ (e) => this.setEditModalStringFieldState('description', e.target.value) }
                                rows={ 10 } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-status">Status</Form.Label>
                            <Form.Control id="edit-status" as="select" value={ this.state.editModal.status.toString() }
                                onChange={ (e) => this.setEditModalStringFieldState('status', e.target.value) }>
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
                            <Button variant="primary" onClick={ () => this.doEditArticle() }>
                                <FontAwesomeIcon icon={ faSave } /> Edit article
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
        this.setAddModalStringFieldState('excerpt', '');
        this.setAddModalStringFieldState('description', '');
        this.setAddModalNumberFieldState('categoryId', '1');
        this.setAddModalNumberFieldState('price', '0.01');

        this.setAddModalVisibleState(true);
    }

    private doAddArticle() {
        const filePicker: any = document.getElementById('add-photo');

        if (filePicker?.files.length === 0) {
            this.setAddModalStringFieldState('message', 'You must select a file to upload!');
            return;
        }

        api('/api/article/', 'post', {
            categoryId: this.state.addModal.categoryId,
            name: this.state.addModal.name,
            excerpt: this.state.addModal.excerpt,
            description: this.state.addModal.description,
            price: this.state.addModal.price,
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

            const articleId: number = res.data.articleId;

            const file = filePicker.files[0];
            await this.uploadArticlePhoto(articleId, file);

            this.setAddModalVisibleState(false);
            this.getArticles();
        });
    }

    private async uploadArticlePhoto(articleId: number, file: File) {
        return await apiFile('/api/article/' + articleId + '/uploadPhoto/', 'photo', file, 'administrator');
    }

    private async showEditModal(article: ProductType) {
        this.setEditModalStringFieldState('message', '');
        this.setEditModalNumberFieldState('articleId', article.productId);
        this.setEditModalStringFieldState('name', String(article.productName));
        this.setEditModalStringFieldState('excerpt', String(article.shortDesc));
        this.setEditModalStringFieldState('description', String(article.detailedDesc));
        this.setEditModalStringFieldState('status', String(article.productStatus));
        this.setEditModalNumberFieldState('price', article.price);
        this.setEditModalNumberFieldState('isPromoted', article.isPromoted);

        if (!article.category?.categoryId) {
            return;
        }

        this.setEditModalVisibleState(true);
    }

    private doEditArticle() {
        api('/api/article/' + this.state.editModal.articleId, 'patch', {
            name: this.state.editModal.name,
            excerpt: this.state.editModal.excerpt,
            description: this.state.editModal.description,
            price: this.state.editModal.price,
            status: this.state.editModal.status,
            isPromoted: this.state.editModal.isPromoted,
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
            this.getArticles();
        });
    }
}

export default AdministratorProducts;