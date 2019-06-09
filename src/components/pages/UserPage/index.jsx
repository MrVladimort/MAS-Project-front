import React, {Component} from 'react';
import {connect} from "react-redux"
import {Menu} from 'semantic-ui-react';
import Profile from './Profile';
import OrderHistory from './OrderHistory';
import PropTypes from "prop-types";

class Index extends Component {
    state = {
        activeMenuItem: this.props.location.hash ? this.props.location.hash : '#profile'
    };

    handleMenuClick = (e, {id}) => this.setState({activeMenuItem: '#' + id});

    render() {
        const {activeMenuItem} = this.state;

        return (
            <div>
                <Menu pointing secondary stackable>
                    <Menu.Item id='profile' content='Profile' active={activeMenuItem === '#profile'}
                               onClick={this.handleMenuClick}/>
                    <Menu.Item id='history' content="History" active={activeMenuItem === '#history'}
                               onClick={this.handleMenuClick}/>
                </Menu>

                {activeMenuItem === '#profile' && <Profile history={this.props.history}/>}
                {activeMenuItem === '#history' && <OrderHistory history={this.props.history}/>}
            </div>
        );
    }
}

Index.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }).isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {};

export default connect(mapStateToProps)(Index);