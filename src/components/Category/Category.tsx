import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Container } from "react-bootstrap";
import CategoryType from "../../types/CategoryType";

interface CategoryProp {
    match: {
        params: {
            id: number;
        }
    }

}

interface CategoryState {
    category?: CategoryType;
}

export default class Category extends React.Component<CategoryProp> {
    state: CategoryState;

    constructor(props: Readonly<CategoryProp>) {
        super(props);
        
        this.state = { }
    }

    render() {
        return (
            <Container>
                <Card>
                    <Card.Body>
                    <FontAwesomeIcon icon={faListAlt}></FontAwesomeIcon>
                    { this.state.category?.name }
                    </Card.Body>
                    <Card.Text>
                        ...
                    </Card.Text>
                </Card>
             
            </Container>
        );
    }

    componentWillMount() {
       this.getCategoryData();
    }

    componentWillReceiveProps(newProp: CategoryProp) {
        if(newProp.match.params.id === this.props.match.params.id) {
            return;
        }
        
        this.getCategoryData();
    }

    private getCategoryData() {
        setTimeout(() => {
            const data: CategoryType = {
                name: 'Category: ' + this.props.match.params.id,
                id: this.props.match.params.id,
                items: []
            };
            
            this.setState({
                category: data,
            })
        }, 750);
    }
}