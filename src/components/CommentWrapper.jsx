import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Comment, Icon, Segment} from "semantic-ui-react";
import moment from "moment";
import {Link} from "react-router-dom";

class CommentWrapper extends Component {
    static propTypes = {};

    render() {
        const {comment} = this.props;
        const {text, grade, eventName, userName, userSurname, createdAt} = comment;

        return (
            <Segment raised>
                <Comment>
                    <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/christian.jpg'/>
                    <Comment.Content>
                        <Comment.Author as='a'>{`${userName} ${userSurname}`}</Comment.Author>
                        <Comment.Metadata>
                            <div>{eventName}</div>
                            <div><Icon name='star'/>{grade} Faves</div>
                            <div>{moment(createdAt).fromNow()}</div>
                        </Comment.Metadata>
                        <Comment.Text>{text}</Comment.Text>
                        <Comment.Actions>
                            <Link to={`/comment/edit?commentId=${comment.id}`}>
                                Edit
                            </Link>
                            <Link to={`/comment/delete?commentId=${comment.id}`}>
                                Delete
                            </Link>
                        </Comment.Actions>
                    </Comment.Content>
                </Comment>
            </Segment>
        )
    }
}


CommentWrapper.propTypes = {
    comment: PropTypes.object.isRequired,
};

export default CommentWrapper;