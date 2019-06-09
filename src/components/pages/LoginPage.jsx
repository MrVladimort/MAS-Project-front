import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux"
import {Container, Header} from 'semantic-ui-react';
import {loginEmail} from "../../actions/auth";
import EmailLogin from '../forms/LoginForm';

class LoginPage extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {
            errors: {}
        }
    }

    submitEmail = data => this.props.loginEmail(data).then(() => this.props.history.push("/user"));

    render() {
        return (
            <div>
                <Container text textAlign='center'>
                    <Header as='h1' color='blue'>Log In</Header>
                </Container>
                <Container text>
                    <EmailLogin submit={this.submitEmail}/>
                </Container>
            </div>
        )
    }
}

LoginPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    loginEmail: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {loginEmail})(LoginPage);