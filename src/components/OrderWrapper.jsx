import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Button, Container, Grid, Header, Segment, Table} from "semantic-ui-react";
import moment from "moment";
import {Link} from "react-router-dom";

class OrderWrapper extends Component {
    static propTypes = {};

    render() {
        const {order} = this.props;
        const {tickets, id, client, status, createdAt, totalPrice} = order;
        const {eventName, eventDate, eventId} = tickets[0];

        return (
            <Segment raised>
                <Segment>
                    <Segment vertical>
                        <Header as={"h1"}>Event: {eventName} | Date: {eventDate}</Header>
                    </Segment>

                    <Segment vertical>
                        <Header as={"h1"}>Order Date: {moment(createdAt).fromNow()}</Header>
                    </Segment>
                </Segment>

                <Segment>
                    <Table padded='very' basic='very' celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Place number</Table.HeaderCell>
                                <Table.HeaderCell>Type</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Surname</Table.HeaderCell>
                                <Table.HeaderCell>Document Type</Table.HeaderCell>
                                <Table.HeaderCell>Document Number</Table.HeaderCell>
                                <Table.HeaderCell>Price</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {tickets.map(ticket => <Table.Row key={`order: ${id} ticket: ${ticket.id}`}>
                                <Table.Cell>{ticket.placeNumber}</Table.Cell>
                                <Table.Cell>{ticket.type}</Table.Cell>
                                <Table.Cell>{ticket.attender.name}</Table.Cell>
                                <Table.Cell>{ticket.attender.surname}</Table.Cell>
                                <Table.Cell>{ticket.attender.documentType}</Table.Cell>
                                <Table.Cell>{ticket.attender.documentNumber}</Table.Cell>
                                <Table.Cell>{ticket.price}</Table.Cell>
                            </Table.Row>)}
                        </Table.Body>
                    </Table>
                </Segment>

                <Segment>
                    <Header as={"h1"}>Total price: {totalPrice}</Header>
                </Segment>

                <Button.Group basic>
                    <Link to={`/order/cancel?orderId=${id}`}>
                        <Button>Cancel order</Button>
                    </Link>
                    <Link to={`/event/exact?eventId=${eventId}`}>
                        <Button>Event page</Button>
                    </Link>
                </Button.Group>
            </Segment>
        )
    }
}


OrderWrapper.propTypes = {
    order: PropTypes.object.isRequired
};


export default OrderWrapper;