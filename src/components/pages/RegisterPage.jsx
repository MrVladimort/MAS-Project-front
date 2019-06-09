import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Container, Header} from 'semantic-ui-react';
import RegisterUser from '../forms/RegisterForm';
import {registerUser} from "../../actions/auth";

class RegisterPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {}
        }
    }
    submitUser = data => this.props.registerUser(data).then(() => this.props.history.push("/user"));

    render() {
        return (
            <Container>
                <Container text textAlign='center'>
                    <Header as='h1' color='blue'>Registration</Header>
                </Container>
                <Container text>
                    <RegisterUser submit={this.submitUser} params={this.props.params}/>
                </Container>
            </Container>
        );
    }
}

RegisterPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    registerUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {registerUser})(RegisterPage);
