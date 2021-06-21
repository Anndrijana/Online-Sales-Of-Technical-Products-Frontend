import React from 'react';
import { Redirect } from 'react-router-dom';
import { removeTokenData } from '../../api/api';

interface CustomerSignOutState {
    done: boolean;
}

export class CustomerSignOut extends React.Component {
    state: CustomerSignOutState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            done: false,
        };
    }

    finished() {
        this.setState({
            done: true,
        });
    }

    render() {
        if (this.state.done) {
            return <Redirect to="/" />
        }

        return (
            <p>Logging out...</p>
        );
    }

    componentDidMount() {
        this.doLogout();
    }

    componentDidUpdate() {
        this.doLogout();
    }

    doLogout() {
        removeTokenData("customer");
        this.finished();
    }
}