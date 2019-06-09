import React, {Component} from 'react';
import {Form, Container, Header, Input} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ErrorMessage from "../baseComponents/ErrorMessage";
import interviewApi from "../../api/interview";
import DatePicker from "react-datepicker";
import moment from "moment";

class AcceptInterviewForm extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {
            formData: {
                teamLeadIndex: 0,
            },
            loading: false,
            errors: {}
        };
    }

    onChange = (e, data) => this.setState({formData: {...this.state.formData, [data.name]: data.value}});

    onSubmit = () => {
        const {formData} = this.state;
        const errors = this.validate(formData);
        this.setState({errors});
        if (_.isEmpty(errors)) {
            this.setState({loading: true});
            this.props.submit(this.props.interviewIndex, this.state.formData.teamLeadIndex)
                .catch(err => this.setState({errors: {global: err.response.data.error}, loading: false}));
        }
    };

    validate = (formData) => {
        const errors = {};
        return _.filter(errors, error => error);
    };

    getDropdownTeamLeads = () => {
        return this.props.teamLeads.map((teamLead, index) => ({key: index, value: index, text: teamLead.surname + " " + teamLead.name}))
    };

    render() {
        const {errors, loading} = this.state;
        return (
            <Container>
                {!_.isEmpty(errors) && <ErrorMessage header='Something went wrong' errors={errors}/>}
                <Form onSubmit={this.onSubmit} loading={loading}>
                    <Header as='h5' content='Team leader *'/>
                    <Form.Dropdown id='teamLeadIndex' name='teamLeadIndex' onChange={this.onChange}
                                   placeholder='Select team lead' selection fluid search
                                   options={this.getDropdownTeamLeads()}/>
                    <Form.Button fluid type='submit' primary content='Accept interview'/>
                </Form>
            </Container>
        );
    }
}

AcceptInterviewForm.propTypes = {
    interviewIndex: PropTypes.number.isRequired,
    teamLeads: PropTypes.array.isRequired,
    submit: PropTypes.func.isRequired
};

export default AcceptInterviewForm;
