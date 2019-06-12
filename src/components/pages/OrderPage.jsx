import React, {Component} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {
    Button,
    Card,
    Container,
    Dimmer,
    Form,
    Grid,
    Header,
    Image,
    Input,
    Loader, Modal,
    Segment,
    Step
} from "semantic-ui-react";
import eventApi from "../../api/event";
import orderApi from "../../api/order";
import OrderWrapper from "../OrderWrapper";
import AttenderWrapper from "../AttenderWrapper"
import DatePicker from "react-datepicker/es";
import InlineError from "../baseComponents/InlineError";

class OrderPage extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {
            orderData: {
                totalPrice: 0,
                tickets: [],
            },

            loading: true,
            event: null,

            paying: "0",

            attenderFormData: {
                name: "",
                surname: "",
                birthdate: "",
                documentType: "",
                documentNumber: ""
            },
            attenderFormDataErrors: {},
            addAttenderModalOpen: false,

            attenders: [],
            pickedAttenders: [],

            ticketType: null,
            ticketTypeChosen: false,
            attendersChosen: false,
            orderConfirmed: false,
        }
    }

    async componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        const eventId = Number(query.get('eventId'));

        const [event, attenders] = await Promise.all([eventApi.getEvent(eventId), orderApi.getAllUserAttenders()]);

        this.setState({event, attenders, loading: false});
    }

    onTicketTypeChange = (e, data) => this.setState({ticketType: data.value});

    onAttenderDataChange = (e, data) => this.setState({
        attenderFormData: {
            ...this.state.attenderFormData,
            [data.name]: data.value
        }
    });

    handleAttenderDatePicker = (date) => this.setState({
        attenderFormData: {
            ...this.state.attenderFormData,
            birthdate: date
        }
    });

    addAttenderModalOpen = () => {
        this.setState({
            addAttenderModalOpen: true,
        });
    };

    addAttenderModalClose = () => {
        this.setState({
            addAttenderModalOpen: false,
            attenderFormData: {
                name: "",
                surname: "",
                birthdate: "",
                documentType: "",
                documentNumber: ""
            },
            attenderFormDataErrors: {},
        });
    };

    addAttender = async () => {
        const {attenderFormData, pickedAttenders, attenders} = this.state;
        const attender = await orderApi.createAttender(attenderFormData);
        if (pickedAttenders.length < 10)
            pickedAttenders.push(attender);
        else
            attenders.push(attender);

        this.setState({pickedAttenders, attenders});
        this.addAttenderModalClose();
    };

    pickAttender = (index) => {
        console.log(index);

        const {attenders, pickedAttenders} = this.state;

        if (pickedAttenders.length < 10) {
            pickedAttenders.push(attenders[index]);
            attenders.splice(index, 1);

            this.setState({attenders, pickedAttenders});
        }
    };

    unpickAttender = (index) => {
        const {attenders, pickedAttenders} = this.state;
        attenders.push(pickedAttenders[index]);
        pickedAttenders.splice(index, 1);

        this.setState({attenders, pickedAttenders});
    };

    chooseAttenders = () => {
        const {pickedAttenders, event, ticketType: type} = this.state;
        const {price, name: eventName, dateTime: eventDate, id: eventId} = event;

        const tickets = pickedAttenders.map(attender => ({
            price: this.getTicketPrice(type, price),
            type,
            attender,
            eventName,
            eventDate,
            eventId
        }));

        const totalPrice = tickets.reduce((accumulator, ticket) => accumulator + ticket.price, 0);

        this.setState({attendersChosen: true, orderData: {totalPrice, tickets}});
    };

    getTicketPrice = (type, price) => {
        switch (type) {
            case "VIP":
                return Math.round(price * 1.5);
            case "REGULAR":
                return price;
            case "FAN_ZONE":
                return Math.round(price * 0.75);
        }
    };

    getAddAttenderModal = () => {
        const {attenderFormData: formData, attenderFormDataErrors: errors, addAttenderModalOpen} = this.state;

        return (
            <Modal open={addAttenderModalOpen} size='small' dimmer='blurring'>
                <Modal.Header><Header as='h3' color='blue' content={`Add attender`}/></Modal.Header>
                <Modal.Content>
                    <Form>
                        <Header as='h5' content='Surname *'/>
                        {!!errors.surname && <InlineError text={errors.surname}/>}
                        <Form.Input required error={!!errors.surname} id='surname' name='surname'
                                    value={formData.surname}
                                    onChange={this.onAttenderDataChange}/>

                        <Header as='h5' content="Name *"/>
                        {!!errors.name && <InlineError text={errors.name}/>}
                        <Form.Input required error={!!errors.name} id='name' name='name' value={formData.name}
                                    onChange={this.onAttenderDataChange}/>

                        <Header as='h5' content="Document number *"/>
                        {!!errors.documentNumber && <InlineError text={errors.documentNumber}/>}
                        <Form.Input required error={!!errors.documentNumber} id='documentNumber' name='documentNumber'
                                    value={formData.documentNumber}
                                    onChange={this.onAttenderDataChange}/>

                        <Header as='h5' content='Document type *'/>
                        {!!errors.documentType && <InlineError text={errors.documentType}/>}
                        <Form.Dropdown id='documentType' name='documentType' onChange={this.onAttenderDataChange}
                                       placeholder='Select document type' selection fluid search
                                       options={[
                                           {key: 0, value: "PASSPORT", text: "Passport"},
                                           {key: 1, value: "ID_CARD", text: "Id card"},
                                           {key: 2, value: "DRIVER_LICENCE", text: "Driver Licence"},
                                       ]}/>

                        <Header as='h5' content='Day of birth *'/>
                        {!!errors.name && <InlineError text={errors.birthdate}/>}
                        <Form.Field error={errors.birthdate}>
                            <DatePicker selected={formData.birthdate} onChange={this.handleAttenderDatePicker}
                                        dateFormat={"dd/MM/yyyy"} todayButton={"Today"} peekNextMonth
                                        showMonthDropdown showYearDropdown dropdownMode="select"
                                        customInput={<Input icon='calendar'/>} maxDate={new Date()}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button content='Submit' primary onClick={this.addAttender}/>
                    <Button content='Cancel' secondary onClick={this.addAttenderModalClose}/>
                </Modal.Actions>
            </Modal>);
    };

    confirmOrder = async () => {
        const {orderData, event} = this.state;

        const confirmedOrder = await orderApi.createOrder(event.id, orderData);

        console.log(confirmedOrder);
        this.setState({orderConfirmed: true, orderData: confirmedOrder})
    };

    payForOrder = async (orderId, amount) => {
        await orderApi.payForOrder(orderId, amount);
        this.props.history.push("/user#history")
    };

    render() {
        const {event, attenders, pickedAttenders, loading, orderData, addAttenderModalOpen, ticketType, ticketTypeChosen, attendersChosen, orderConfirmed} = this.state;

        return (

            <Container>
                <Step.Group fluid ordered>
                    <Step active={!ticketTypeChosen} completed={ticketTypeChosen}>
                        <Step.Content>
                            <Step.Title>Ticket Type</Step.Title>
                            <Step.Description>Choose ticket type</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step active={!attendersChosen && ticketTypeChosen} completed={attendersChosen}>
                        <Step.Content>
                            <Step.Title>Choose attenders</Step.Title>
                            <Step.Description>Choose attenders form list or add new one</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step active={!orderConfirmed && attendersChosen} completed={orderConfirmed}>
                        <Step.Content>
                            <Step.Title>Confirm Order</Step.Title>
                        </Step.Content>
                    </Step>

                    <Step active={orderConfirmed}>
                        <Step.Content>
                            <Step.Title>Pay Order</Step.Title>
                        </Step.Content>
                    </Step>
                </Step.Group>

                <Container>
                    {loading && <Dimmer active inverted><Loader size='massive'>Loading</Loader></Dimmer>}

                    {!ticketTypeChosen && <Container text>
                        <Form onSubmit={() => this.setState({ticketTypeChosen: true})} loading={loading}>
                            <Header as='h5' content='Ticket type *'/>
                            <Form.Dropdown id='ticketType' name='ticketType' onChange={this.onTicketTypeChange}
                                           placeholder='Select time' selection fluid search
                                           options={[
                                               {key: 0, value: "VIP", text: "Vip"},
                                               {key: 1, value: "REGULAR", text: "Regular"},
                                               {key: 2, value: "FAN_ZONE", text: "Fan Zone"},
                                           ]}/>
                            <Form.Button fluid type='submit' disabled={!ticketType} primary
                                         content='Choose ticket type'/>
                        </Form>
                    </Container>}

                    {ticketTypeChosen && !attendersChosen && <div>
                        {addAttenderModalOpen && this.getAddAttenderModal()}
                        <Button.Group vertical fluid>
                            <Button fluid color='grey' onClick={this.addAttenderModalOpen}>Add Attender</Button>
                            <Button disabled={pickedAttenders.length === 0} fluid color='blue'
                                    onClick={this.chooseAttenders}>Choose attenders</Button>
                        </Button.Group>
                        <Grid columns={2} celled>
                            <Grid.Column>
                                <Header content="Attenders"/>
                                <Card.Group itemsPerRow={1}>
                                    {attenders.map((attender, index) => {
                                        return (
                                            <AttenderWrapper key={`attender: ${attender.id}`} attender={attender}
                                                             onClick={() => this.pickAttender(index)}/>);
                                    })}
                                </Card.Group>
                            </Grid.Column>

                            <Grid.Column>
                                <Header content="Tickets"/>
                                <Card.Group itemsPerRow={1}>
                                    {pickedAttenders.map((attender, index) => {
                                        return (
                                            <AttenderWrapper key={`attender: ${attender.id}`} attender={attender}
                                                             onClick={() => this.unpickAttender(index)}/>);
                                    })}
                                </Card.Group>
                            </Grid.Column>
                        </Grid>
                    </div>}

                    {event && attendersChosen &&
                    <div>
                        <OrderWrapper order={orderData} eventDate={event.name} eventName={event.dateTime}
                                      payForOrder={this.payForOrder}/>
                        {!orderConfirmed && <Button disabled={pickedAttenders.length === 0} fluid color='blue'
                                                    onClick={this.confirmOrder}>Confirm order</Button>}
                    </div>}
                </Container>
            </Container>

        )
    }
}


OrderPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};
const mapStateToProps = (state) => ({
    isAuth: !!state.auth.token,
    user: state.user
});

export default connect(mapStateToProps)(OrderPage);