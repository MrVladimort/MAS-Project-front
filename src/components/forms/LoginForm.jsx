import React, {Component} from 'react';
import {Form, Container, Header} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ErrorMessage from "../baseComponents/ErrorMessage";

class EmailLogin extends Component {
    state = {
        formData: {
            email: "",
            password: ""
        },
        loading: false,
        errors: {}
    };

    onChange = e => this.setState({formData: {...this.state.formData, [e.target.name]: e.target.value}});

    onSubmit = () => {
        const {formData} = this.state;
        const errors = this.validate(formData);
        this.setState({errors});
        if (_.isEmpty(errors)) {
            this.setState({loading: true});
            this.props.submit({...formData, email: formData.email.toLowerCase()})
                .catch(err => this.setState({errors: {global: err.response.data.error}, loading: false}));
        }
    };

    validate = (formData) => {
        const errors = {};
        return _.filter(errors, error => error);
    };

    render() {
        const {formData, errors, loading} = this.state;
        return (
            <Container>
                {!_.isEmpty(errors) && <ErrorMessage header='Something went wrong' errors={errors}/>}
                <Form onSubmit={this.onSubmit} loading={loading}>
                    <Header as='h5' content='Email *'/>
                    <Form.Input required error={!!errors.LoginForm} type='email' id='email' name='email'
                                placeholder='mail@mail.ua' value={formData.email} onChange={this.onChange}/>
                    <Header as='h5' content='Password *'/>
                    <Form.Input required error={!!errors.pass} type='password' id='password' name='password'
                        value={formData.password} onChange={this.onChange}/>
                    <Form.Button fluid type='submit' primary content='Log in'/>
                </Form>
            </Container>
        );
    }
}

EmailLogin.propTypes = {
    submit: PropTypes.func.isRequired
};

export default EmailLogin;
