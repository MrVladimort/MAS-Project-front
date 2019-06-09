import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Message} from "semantic-ui-react";
import _ from 'lodash';

class ErrorMessage extends Component {
    render() {
        const {header, errors} = this.props;
        let mappedErrors = _.map(errors, error => error);

        return <Message className='errorMessage' size='small' error icon='attention' list={mappedErrors} header={header}/>;
    }
}

ErrorMessage.propTypes = {
    header: PropTypes.string.isRequired,
    errors: PropTypes.shape(

    ).isRequired
};

export default ErrorMessage;
