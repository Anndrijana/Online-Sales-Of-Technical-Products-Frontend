import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import CategoryType from '../../types/CategoryType';
import RoledNavbar from '../RoledNavbar/RoledNavbar';
import ApiCategoryDto from '../../dtos/CategoryDto';

interface AdministratorCategoriesState {
    isAdministratorLoggedIn: boolean;
    categories: CategoryType[];

    addModal: {
        visible: boolean;
        categoryName: string;
        imagePath: string;
        parentCategoryId: number | null;
        message: string;
    };

    editModal: {
        categoryId?: number;
        visible: boolean;
        categoryName: string;
        imagePath: string;
        parentCategoryId: number | null;
        message: string;
    };
}

class AdministratorCategories extends React.Component {
    state:  AdministratorCategoriesState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            categories: [],

            addModal: {
                visible: false,
                categoryName: '',
                imagePath: '',
                parentCategoryId: null,
                message: '',
            },

            editModal: {
                visible: false,
                categoryName: '',
                imagePath: '',
                parentCategoryId: null,
                message: '',
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

        const newState = Object.assign(this.state, {
            categories: categories,
        });

        this.setState(newState);
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
                            <FontAwesomeIcon icon={ faListAlt } color="#C62E65"/> List of all categories
                        </Card.Title>

                        <Table hover size="sm" bordered>
                            <thead>
                                <tr>
                                    <th colSpan={ 3 }></th>
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
                                    <th className="text-right">Parent ID</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.categories.map(category => (
                                    <tr>
                                        <td className="text-right">{ category.categoryId }</td>
                                        <td>{ category.categoryName }</td>
                                        <td className="text-right">{ category.parentCategoryId }</td>
                                        <td className="text-center">

                                            <Button variant="info" size="sm"
                                                onClick={ () => this.showEditModal(category) }>
                                                <FontAwesomeIcon icon={ faEdit } /> Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ), this) }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal size="lg" centered show={ this.state.addModal.visible } onHide={ () => this.setAddModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="categoryName">Name</Form.Label>
                            <Form.Control id="categoryName" type="text" value={ this.state.addModal.categoryName }
                                onChange={ (e) => this.setAddModalStringFieldState('categoryName', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="imagePath">Image URL</Form.Label>
                            <Form.Control id="imagePath" type="url" value={ this.state.addModal.imagePath }
                                onChange={ (e) => this.setAddModalStringFieldState('imagePath', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="parentCategoryId">Parent category</Form.Label>
                            <Form.Control id="parentCategoryId" as="select" value={ this.state.addModal.parentCategoryId?.toString() }
                                onChange={ (e) => this.setAddModalNumberFieldState('parentCategoryId', e.target.value) }>
                                <option value="null">No parent category</option>
                                { this.state.categories.map(category => (
                                    <option value={ category.categoryId?.toString() }>
                                        { category.categoryName }
                                    </option>
                                )) }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={ () => this.doAddCategory() }>
                                <FontAwesomeIcon icon={ faPlus } /> Add new category
                            </Button>
                        </Form.Group>
                        { this.state.addModal.message ? (
                            <Alert variant="danger" value={ this.state.addModal.message } />
                        ) : '' }
                    </Modal.Body>
                </Modal>

                <Modal size="lg" centered show={ this.state.editModal.visible } onHide={ () => this.setEditModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="categoryName">Name</Form.Label>
                            <Form.Control id="categoryName" type="text" value={ this.state.editModal.categoryName }
                                onChange={ (e) => this.setEditModalStringFieldState('categoryName', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="imagePath">Image URL</Form.Label>
                            <Form.Control id="imagePath" type="url" value={ this.state.editModal.imagePath }
                                onChange={ (e) => this.setEditModalStringFieldState('imagePath', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="parentCategoryId">Parent category</Form.Label>
                            <Form.Control id="parentCategoryId" as="select" value={ this.state.editModal.parentCategoryId?.toString() }
                                onChange={ (e) => this.setEditModalNumberFieldState('parentCategoryId', e.target.value) }>
                                <option value="null">No parent category</option>
                                { this.state.categories
                                    .filter(category => category.categoryId !== this.state.editModal.categoryId)
                                    .map(category => (
                                    <option value={ category.categoryId?.toString() }>
                                        { category.categoryName }
                                    </option>
                                )) }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={ () => this.doEditCategory() }>
                                <FontAwesomeIcon icon={ faEdit } /> Edit category
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
        this.setAddModalStringFieldState('categoryName', '');
        this.setAddModalStringFieldState('imagePath', '');
        this.setAddModalStringFieldState('message', '');
        this.setAddModalNumberFieldState('parentCategoryId', 'null');
        this.setAddModalVisibleState(true);
    }

    private doAddCategory() {
        api('/api/category/', 'put', {
            categoryName: this.state.addModal.categoryName,
            imagePath: this.state.addModal.imagePath,
            parentCategoryId: this.state.addModal.parentCategoryId,
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

            this.setAddModalVisibleState(false);
            this.getCategories();
        });
    }

    private showEditModal(category: CategoryType) {
        this.setEditModalStringFieldState('categoryName', String(category.categoryName));
        this.setEditModalStringFieldState('imagePath', String(category.imagePath));
        this.setEditModalStringFieldState('message', '');
        this.setEditModalNumberFieldState('parentCategoryId', category.parentCategoryId);
        this.setEditModalNumberFieldState('categoryId', category.categoryId);
        this.setEditModalVisibleState(true);
    }

    private doEditCategory() {
        api('/api/category/' + this.state.editModal.categoryId, 'post', {
            categoryName: this.state.editModal.categoryName,
            imagePath: this.state.editModal.imagePath,
            parentCategoryId: this.state.editModal.parentCategoryId,
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
            this.getCategories();
        });
    }
}

export default AdministratorCategories;