import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Header, Container, Segment, Grid, Button} from "semantic-ui-react";
import orderApi from "../../../api/order"
import OrderWrapper from "../../OrderWrapper";
import {Link} from "react-router-dom";

class OrderHistory extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {
            orders: []
        }
    }

    componentDidMount = async () => {
        const orders = await orderApi.getAllClientOrders();
        this.setState({orders});
    };

    payForOrder = async (orderId, amount) => {
        let {orders} = this.state;
        const paidOrder = await orderApi.payForOrder(orderId, amount);

        orders[orders.findIndex(order => order.id === paidOrder.id)] = paidOrder;

        this.setState({orders})
    };

    render() {
        const {orders} = this.state;
        return (
            <Container>
                {orders.length > 0 && orders.map(order => {
                    const {status} = order;

                    const isRealised = status === "REALISED";
                    const isPaid = status === "PAID";
                    const isCanceled = status === "CANCELED";
                    const isConfirmed = status === "CONFIRMED";

                    return (
                        <Segment
                            color={isCanceled ? "red" : isConfirmed ? "yellow" : isPaid ? "blue" : isRealised ? "green" : ""}
                            key={`order: ${order.id}`}>
                            <Header content={`Order status: ${status}`}/>
                            <OrderWrapper order={order} eventDate={order.tickets[0].eventDate}
                                          eventName={order.tickets[0].eventName} payForOrder={this.payForOrder}/>
                            <Container text textAlign='center'>
                                <Button.Group basic>
                                    <Link to={`/order/cancel?orderId=${order.id}`}>
                                        <Button>Cancel order</Button>
                                    </Link>
                                    <Link to={`/event/exact?eventId=${order.tickets[0].eventId}`}>
                                        <Button>Event page</Button>
                                    </Link>
                                </Button.Group>
                            </Container>
                        </Segment>)
                })}
            </Container>
        );
    }
}

OrderHistory.propTypes = {
    user: PropTypes.shape(),
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(OrderHistory);
