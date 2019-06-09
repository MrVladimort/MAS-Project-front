import React, {Component} from 'react';
import {Form, Container, Header} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ErrorMessage from "../baseComponents/ErrorMessage";

class AddCvForm extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {
            formData: {
                linkToCV: "",
            },
            loading: false,
            errors: {}
        };
    }



    onChange = e => this.setState({formData: {...this.state.formData, [e.target.name]: e.target.value}});

    onSubmit = () => {
        const {formData} = this.state;
        const errors = this.validate(formData);
        this.setState({errors});
        if (_.isEmpty(errors)) {
            this.setState({loading: true});
            this.props.submit(this.props.recruitmentIndex, formData.linkToCV)
                .catch(err => this.setState({errors: {global: err.response.data.error}, loading: false}));
        }
    };

    validate = (formData) => {
        const errors = {};
        return _.filter(errors, error => error);
    };

    render() {
        const {formData, errors, loading} = this.state;
        return (
            <Container>
                {!_.isEmpty(errors) && <ErrorMessage header='Something went wrong' errors={errors}/>}
                <Form onSubmit={this.onSubmit} loading={loading}>
                    <Header as='h5' content='Link to CV *'/>
                    <Form.Input required error={!!errors.linkToCV} type='text' id='linkToCV' name='linkToCV'
                                placeholder='cv.com/my/1' value={formData.linkToCV} onChange={this.onChange}/>
                    <Form.Button fluid type='submit' primary content='Add CV'/>
                </Form>
            </Container>
        );
    }
}

AddCvForm.propTypes = {
    recruitmentIndex: PropTypes.number.isRequired,
    submit: PropTypes.func.isRequired
};

export default AddCvForm;
