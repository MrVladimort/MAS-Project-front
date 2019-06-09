import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Container, Form, Header } from "semantic-ui-react";
import ErrorMessage from "../baseComponents/ErrorMessage";
import InlineError from "../baseComponents/InlineError";

class RegisterUser extends Component {
  state = {
    formData: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      password: "",
      repeatPassword: ""
    },
    loading: false,
    errors: {}
  };

  onSubmit = () => {
    const { formData } = this.state;

    const errors = this.validate(formData);
    this.setState({ errors });

    if (_.isEmpty(errors)) {
      this.setState({ loading: true });
      this.props.submit(formData).catch(err => this.setState({ errors: { global: err.response.data.error }, loading: false }));
    }
  };

  onChange = e => this.setState({ formData: { ...this.state.formData, [e.target.name]: e.target.value } });

  validate = (formData) => {
    const errors = {};
    return _.filter(errors, error => error);
  };

  render() {
    const { formData, errors, loading } = this.state;

    return (
      <Container>
        {!_.isEmpty(errors) && <ErrorMessage header='Something went wrong' errors={errors}/>}
        <Form onSubmit={this.onSubmit} loading={loading}>
          <Header as='h5' content='Surname *'/>
          {!!errors.surname && <InlineError text={errors.surname}/>}
          <Form.Input required error={!!errors.surname} id='surname' name='surname' value={formData.surname}
                      onChange={this.onChange}/>

          <Header as='h5' content="Name *"/>
          {!!errors.name && <InlineError text={errors.name}/>}
          <Form.Input required error={!!errors.name} id='name' name='name' value={formData.name}
                      onChange={this.onChange}/>

          <Header as='h5' content={"Email *"}/>
          {!!errors.LoginForm && <InlineError text={errors.LoginForm}/>}
          <Form.Input required error={!!errors.LoginForm} type='email' id='email'
                      name='email'
                      value={formData.email} placeholder='mail@mail.ua'
                      onChange={this.onChange}/>

          <Header as='h5' content={"Phone *"}/>
          {!!errors.phone && <InlineError text={errors.phone}/>}
          <Form.Input required error={!!errors.phone} type='phone' id='phone'
                      name='phone'
                      value={formData.phone} placeholder='+1234567890'
                      onChange={this.onChange}/>

          <Header as='h5' content='Password *'/>
          {!!errors.password && <InlineError text={errors.password}/>}
          <Form.Input required error={!!errors.password} type='password' id='password' name='password'
                      value={formData.password}
                      onChange={this.onChange}/>

          <Header as='h5' content='Repeat password *'/>
          {!!errors.repeatPassword && <InlineError text={errors.repeatPassword}/>}
          <Form.Input required error={!!errors.repeatPassword} type='password' id='repeatPassword' name='repeatPassword'
                      value={formData.repeatPassword} onChange={this.onChange}/>

          <Form.Button fluid type='submit' primary content='Sign Up'/>
        </Form>
      </Container>
    );
  }
}


RegisterUser.propTypes = {
  submit: PropTypes.func.isRequired,
};

export default RegisterUser;
