import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Header, Container, Segment, Grid} from "semantic-ui-react";
import orderApi from "../../../api/order"
import OrderWrapper from "../../OrderWrapper";

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
                        <Segment inverted
                                 color={isCanceled ? "red" : isConfirmed ? "yellow" : isPaid ? "blue" : isRealised ? "green" : ""}
                                 key={`order: ${order.id}`}>
                            <Header content={`Order status: ${status}`}/>
                            <OrderWrapper order={order}/>
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
