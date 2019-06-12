import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Button, Container, Grid, Header, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";

class EventWrapper extends Component {
    static propTypes = {};

    render() {
        const {event} = this.props;

        return (
            <Segment raised>
                <Grid>
                    <Grid.Column width={13}>
                        <Segment>
                            <div>
                                <Segment vertical>
                                    <Header as={"h1"}>Name: {event.name} |
                                        Location: {event.localization.name}</Header>
                                </Segment>
                                <Segment vertical>
                                    <Header as={"h1"}>Date: {event.dateTime}</Header>
                                </Segment>
                                <Segment vertical>
                                    <Header as={"h1"}>Places count: {event.placeCount} |
                                        Price: {event.price}</Header>
                                </Segment>
                                {event.artists.map(artist => <Segment vertical
                                                                      key={`event:${event.id} artist:${artist.id}`}>
                                    <Header
                                        as={"h3"}>{`Artist: ${artist.name} | Style: ${artist.style}`}</Header></Segment>)}
                            </div>
                        </Segment>
                    </Grid.Column>

                    <Grid.Column width={3} textAlign="center" verticalAlign="middle">
                        <Button.Group basic vertical>
                            <Link to={`/order/add?eventId=${event.id}`}>
                                <Button content={"Order"}/>
                            </Link>
                            {/*<Link to={`/event/exact?eventId=${event.id}`}>*/}
                            {/*    <Button content={"Event"}/>*/}
                            {/*</Link>*/}
                            {/*<Link to={`/event/delete?eventId=${event.id}`}>*/}
                            {/*    <Button content={"Delete"}/>*/}
                            {/*</Link>*/}
                            {/*<Link to={`/event/edit?eventId=${event.id}`}>*/}
                            {/*    <Button content={"Edit"}/>*/}
                            {/*</Link>*/}
                            {/*<Link to={`/event/artist?eventId=${event.id}`}>*/}
                            {/*    <Button content={"Edit Artists"}/>*/}
                            {/*</Link>*/}
                        </Button.Group>
                    </Grid.Column>
                </Grid>
            </Segment>
        )
    }
}


EventWrapper.propTypes = {
    event: PropTypes.object.isRequired
};


export default EventWrapper;