import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Button, Card, Comment, Icon, Image, Segment} from "semantic-ui-react";
import moment from "moment";
import {Link} from "react-router-dom";

class CommentWrapper extends Component {
    static propTypes = {};

    render() {
        const {ticket} = this.props;
        const {} = ticket;

        return (
            <Card>
                <Card.Content>
                    <Image floated='right' size='mini'
                           src='https://react.semantic-ui.com/images/avatar/small/christian.jpg'/>
                    <Card.Header>Steve Sanders</Card.Header>
                    <Card.Meta>Friends of Elliot</Card.Meta>
                    <Card.Description>
                        Steve wants to add you to the group <strong>best friends</strong>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button fluid basic color='red' onClick={this.props.onClick}>
                        Remove from order
                    </Button>
                </Card.Content>
            </Card>
        )
    }
}


CommentWrapper.propTypes = {
    ticket: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
};

export default CommentWrapper;