import React, { Component } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import { Input, Form } from "semantic-ui-react";
import moment from "moment";
import "moment/locale/uk";

import "react-datepicker/dist/react-datepicker.css";

class DateInput extends Component {
    state = {
        value: null
    };

    onChangeDatepicker = e => {
        const {onChange, parentName} = this.props;
        this.setState({ value: e });
        console.log(e);
        if (e) onChange(parentName, moment(e).format("dd-mm-yyyy"));
    };

    render() {
        const { value } = this.state;
        const { error, disabled, minDate, maxDate, excludeDates, placeholder } = this.props;

        return <Form.Field error={error} disabled={disabled}>
            <DatePicker selected={value} onChange={this.onChangeDatepicker}
                        customInput={
                            <Input icon='calendar'/>
                        }
                        dateFormat='dd-mm-yyyy' placeholderText={placeholder} showYearDropdown
                        scrollableYearDropdown yearDropdownItemNumber={2} maxDate={maxDate}
                        minDate={minDate} excludeDates={excludeDates}
            />
        </Form.Field>;
    }
}

DateInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    error: PropTypes.bool,
    disabled: PropTypes.bool,
    parentName: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    minDate: PropTypes.shape(),
    maxDate: PropTypes.shape(),
    excludeDates: PropTypes.arrayOf(PropTypes.shape())
};

DateInput.defaultProps = {
    minDate: null,
    maxDate: null,
    excludeDates: [],
    error: false,
    disabled: false,
    placeholder: 'dd-mm-yyyy'
};

export default DateInput;
