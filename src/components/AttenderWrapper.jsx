import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Button, Card, Comment, Icon, Image, Segment} from "semantic-ui-react";
import moment from "moment";
import {Link} from "react-router-dom";

class CommentWrapper extends Component {
    static propTypes = {};

    render() {
        const {attender} = this.props;
        const {name, surname, birthdate, documentType, documentNumber} = attender;

        return (
            <Card onClick={this.props.onClick}>
                <Card.Content>
                    <Image floated='right' size='mini'
                           src='https://react.semantic-ui.com/images/avatar/small/christian.jpg'/>
                    <Card.Header>{name} {surname}</Card.Header>
                    <Card.Meta>{birthdate}</Card.Meta>
                    <Card.Description>
                        {documentType}: <strong>{documentNumber}</strong>
                    </Card.Description>
                </Card.Content>
            </Card>
        )
    }
}


CommentWrapper.propTypes = {
    attender: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
};

export default CommentWrapper;