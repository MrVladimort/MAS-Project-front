import React, {Component} from 'react';
import {Form, Container, Header, Input} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ErrorMessage from "../baseComponents/ErrorMessage";
import interviewApi from "../../api/interview";
import DatePicker from "react-datepicker";
import moment from "moment";

class AddInterviewForm extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {
            formData: {
                date: new Date(),
                time: null
            },
            times: [],
            loading: true,
            errors: {}
        };
    }

    componentDidMount = async () => {
        const times = await interviewApi.getTime();

        this.setState({times, loading: false})
    };

    onChange = (e, data) => this.setState({formData: {...this.state.formData, [data.name]: data.value}});

    handleDatePicker = (date) => this.setState({formData: {...this.state.formData, date}});

    onSubmit = () => {
        const {formData} = this.state;
        const errors = this.validate(formData);
        this.setState({errors});
        if (_.isEmpty(errors)) {
            this.setState({loading: true});
            this.props.submit(this.props.recruitmentIndex, {...formData, date: moment(formData.date).format("YYYY-MM-DD")})
                .catch(err => this.setState({errors: {global: err.response.data.error}, loading: false}));
        }
    };

    validate = (formData) => {
        const errors = {};
        return _.filter(errors, error => error);
    };

    getDropdownTime = () => {
        return this.state.times.map((time, index) => ({key: index, value: time, text: time}))
    };

    render() {
        const {formData, errors, loading} = this.state;
        return (
            <Container>
                {!_.isEmpty(errors) && <ErrorMessage header='Something went wrong' errors={errors}/>}
                <Form onSubmit={this.onSubmit} loading={loading}>
                    <Header as='h5' content='Time of interview *'/>
                    <Form.Dropdown id='time' name='time' onChange={this.onChange}
                                   placeholder='Select time' selection fluid search
                                   options={this.getDropdownTime()}/>
                    <Header as='h5' content='Date of interview *'/>
                    <Form.Field error={errors.date}>
                        <DatePicker selected={formData.date} onChange={this.handleDatePicker}
                                    dateFormat={"dd/MM/yyyy"}
                                    customInput={<Input icon='calendar'/>} minDate={new Date()}/>
                    </Form.Field>
                    <Form.Button fluid type='submit' primary content='Add CV'/>
                </Form>
            </Container>
        );
    }
}

AddInterviewForm.propTypes = {
    recruitmentIndex: PropTypes.number.isRequired,
    submit: PropTypes.func.isRequired
};

export default AddInterviewForm;
