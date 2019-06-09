import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Button, Container, Form, Grid, Header, Input, Segment, Table} from "semantic-ui-react";
import moment from "moment";
import InlineError from "./baseComponents/InlineError";

class OrderWrapper extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {
            paying: "",
            error: null
        }
    }

    onPayChange = (e, data) => this.setState({
        [data.name]: data.value
    });

    payForOrder = async () => {
        await this.props.payForOrder(this.props.order.id, this.state.paying);
    };

    render() {
        const {paying, error} = this.state;
        const {order, eventName, eventDate} = this.props;
        const {tickets, id, createdAt, totalPrice, status} = order;

        return (
            <Segment raised>
                <Segment>
                    <Segment vertical>
                        <Header as={"h1"}>Event: {eventName} | Date: {eventDate}</Header>
                    </Segment>

                    {createdAt && <Segment vertical>
                        <Header as={"h1"}>Order Date: {moment(createdAt).format("MMMM Do YYYY, h:mm:ss a")}</Header>
                    </Segment>}
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
                            {tickets.map(ticket => <Table.Row
                                key={`order: ${id} ticket: ${ticket.id} suname: ${ticket.attender.surname} documentNumber: ${ticket.attender.documentNumber}`}>
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

                {status === "CONFIRMED" && <Container text><Form>
                    <Header as='h5' content='Amount to pay *'/>
                    {!!error && <InlineError text={error}/>}
                    <Form.Input required error={!!error} id='paying' name='paying'
                                value={paying}
                                onChange={this.onPayChange}/>
                    <Form.Button fluid content="Submit" primary onClick={this.payForOrder}/>
                </Form></Container>}
            </Segment>
        )
    }
}


OrderWrapper.propTypes = {
    order: PropTypes.object.isRequired,
    payForOrder: PropTypes.func.isRequired,
    eventName: PropTypes.string.isRequired,
    eventDate: PropTypes.string.isRequired
};


export default OrderWrapper;