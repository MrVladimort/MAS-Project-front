import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import {connect} from "react-redux";

class Footer extends Component {
    render() {
        return (
            <div className='footer'>
                <Menu size='small' stackable borderless className='footer'>

                </Menu>
            </div>
        )
    }
}

export default connect()(Footer);