import React, {Component} from 'react';
import PropTypes from 'prop-types';

class InlineError extends Component {
    render() {
        const {text} = this.props;
        return <span style={{ color: "#ae5856" }}>{text}</span>;
    }
}

InlineError.propTypes = {
    text: PropTypes.string.isRequired
};

export default InlineError;
