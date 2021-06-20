import React from 'react';
import { Redirect } from 'react-router-dom';
import { removeTokenData } from '../../api/api';

interface AdministratorSignOutState {
    done: boolean;
}

export class AdministratorSignOut extends React.Component {
    state: AdministratorSignOutState;

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
            return <Redirect to="/admin/login/" />
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
        removeTokenData("administrator");
        this.finished();
    }
}