import React, {Component} from 'react';
import {Menu, Button } from 'semantic-ui-react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logout} from '../../actions/auth';
import mainConfig from "../../configs/main";

class Header extends Component {
    state = {
        activeItem: null
    };

    handleItemClick = (e, {name}) => this.setState({activeItem: name});

    clickLogout = () => {
        const {logout, history, dispatch} = this.props;
        logout(dispatch);
        history.push('/');
    };

    render() {
        const {isAuth, user} = this.props;

        return (
            <div className='header'>
                <Menu fluid compact size='massive' borderless fixed='top'>
                    <Menu.Item>
                        <img src='https://donejs.com/static/img/react-logo.png'/>
                    </Menu.Item>
                    <Menu.Item name='Home page' onClick={this.handleItemClick}
                               href={`${mainConfig.clientHost}/`}/>
                    <Menu.Item name='Events' onClick={this.handleItemClick} href={`${mainConfig.clientHost}/events`}/>
                    <Menu.Item name='Artists' onClick={this.handleItemClick} href={`${mainConfig.clientHost}/artists`}/>

                    <Menu.Menu position='right'>
                        {!isAuth &&
                        <Menu.Item><Button primary href={`${mainConfig.clientHost}/login`}>Sign In</Button></Menu.Item>}
                        {!isAuth && <Menu.Item><Button secondary href={`${mainConfig.clientHost}/register`}>Sign Up</Button></Menu.Item>}

                        {isAuth && <Menu.Item><Button primary href={`${mainConfig.clientHost}/user`}>{`Hello, ${user.name} ${user.surname}`}</Button></Menu.Item>}
                        {isAuth && <Menu.Item><Button secondary onClick={this.clickLogout}>Logout</Button></Menu.Item>}
                    </Menu.Menu>
                </Menu>
            </div>
        )
    }
}

Header.propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    isAuth: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    isAuth: !!state.auth.token,
});

export default connect(mapStateToProps, {logout})(Header);