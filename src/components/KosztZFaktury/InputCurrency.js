import React, { Component } from 'react'

const currencyFormatter = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN'
});

function removeCommaAndWhitespace(value) {
    let result = value.trim().replace(/,/g, '.').replace(/\s+/g, '');
    return result;
}

function convertStringToNumber(value) {
    let result = removeCommaAndWhitespace(value);
    return parseFloat(result).toFixed(2);
}

function convertNumberToFormattedString(value) {
    let result = removeCommaAndWhitespace(value);
    return currencyFormatter.format(result);
}

class InputCurrency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        }
        this.currencyRegEx = /^-?\d+(\.|\,)?\d{0,2}$/;
    }

    componentDidMount() {
        this.setState({
            //value: this.props.value
        })
    }

    handleInput = (evt) => {
        const value = evt.target.value.trim();
        const isValidInput = value === '' || value === '-' || this.currencyRegEx.test(value);
        const { name } = this.props
        console.log('isValidInput', isValidInput, value, name);

        if (isValidInput) {
            this.props.onChange({ [name]: value })
            //this.setState({ value });
        }
    }

    handleFocus(evt) {
        const value = evt.target.value;
        const parsedValue = convertStringToNumber(value);
        console.log('focus', value, ' -> ', parsedValue);

        if (value === '') {
            this.setState({ value: value });
        }
        else if (!Number.isNaN(parsedValue)) {
            this.setState({ value: parsedValue });
        }
    }

    handleBlur(evt) {
        const value = evt.target.value;
        const formattedValue = convertNumberToFormattedString(value);
        console.log('blur', value, ' -> ', formattedValue);

        if (value === '' || value === '-') {
            this.setState({ value: '' });
        }
        else {
            this.setState({ value: formattedValue });
        }
    }

    render() {
        return (
            <React.Fragment>
            <input type="text" className="currency"
                onInput={this.handleInput.bind(this)}
                onBlur={this.handleBlur.bind(this)}
                onFocus={this.handleFocus.bind(this)}
                    value={this.props.value} />
            </React.Fragment>
        )
    }
}

export { InputCurrency }