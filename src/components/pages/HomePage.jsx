import React, {Component} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Container, Grid, Comment} from "semantic-ui-react";
import eventApi from "../../api/event";
import EventWrapper from "../EventWrapper";
import CommentWrapper from "../CommentWrapper";

class HomePage extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {
            events: [],
            comments: []
        }
    }

    async componentDidMount() {
        const [events] = await Promise.all([eventApi.getAllEvents()]);
        const comments = events.reduce((accumulator, currentEvent) => accumulator.concat(...currentEvent.comments), []);
        this.setState({events, comments});
    }

    render() {
        const {events, comments} = this.state;

        return (
                <Grid columns={2} celled="internally">
                    <Grid.Column width={12}>
                        {events.length > 0
                        && events.map(event => <EventWrapper event={event} key={`event: ${event.id}`}/>)}
                    </Grid.Column>

                    <Grid.Column width={4}>
                        {comments.length > 0
                        && comments.map(comment => <Comment.Group size='large' key={`comment: ${comment.id}`}><CommentWrapper comment={comment}/></Comment.Group>)}
                    </Grid.Column>
                </Grid>
        )
    }
}


HomePage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};
const mapStateToProps = (state) => ({
    isAuth: !!state.auth.token,
    user: state.user
});

export default connect(mapStateToProps)(HomePage);