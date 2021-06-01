import React from 'react';

interface CustomerRegistrationState {
    formData: {
        email: string;
        password: string;
        forename: string;
        surname: string;
        phoneNumber: string;
        address: string;
        city: string;
        postalAddress: string;
    };

    message?: string;

    isRegistrationComplete: boolean;
}

export class CustomerRegistration extends React.Component {
    state: CustomerRegistrationState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isRegistrationComplete: false,
            formData: {
                email: '',
                password: '',
                forename: '',
                surname: '',
                phoneNumber: '',
                address: '',
                city: '',
                postalAddress: '',
            },
        };
    }
}