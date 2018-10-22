import React, { Component } from 'react'

function removeCommaAndWhitespace(value) {
    let result = value.trim().replace(/,/g, '.').replace(/\s+/g, '');
    return result;
}

function convertNumberToFormattedString(value) {
    if (isNaN(value)) return ''
    if (typeof (value) === 'number') return value.toFixed(2)
    let result = removeCommaAndWhitespace(value);
    return parseFloat(result).toFixed(2)
}
class InputCurrency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            editTimeValue: props.value,
            value: props.value,
            edited: false,
        }
        this.currencyRegEx = /^-?\d+(\.|\,)?\d{0,2}$/;
    }

    componentDidMount() {
        this.setState({
            //value: this.props.value
        })
    }

    onChange = (evt) => {
        console.log('onChange ' + this.state.edited + ' ' + typeof (this.state.edited))
        const value = evt.target.value;
        const isValidInput = value === '' || value === '-' || this.currencyRegEx.test(value);

        if (isValidInput) {
            //this.props.onChange({ [name]: value })
            this.setState({ editTimeValue: value })
        }
    }

    onFocus = (evt) => {
        this.setState({ editTimeValue: evt.target.value, edited: true, })
    }

    onBlur = (evt) => {
        const { name } = this.props
        const value = evt.target.value;

        this.props.onChange({ [name]: this.convertToNumber(value) })
        this.setState({ edited: false, })
    }

    convertToNumber = (value) => {
        //console.log('convertToNumber ' + typeof (value))
        if (typeof (value) === 'number') return value
        let result = removeCommaAndWhitespace(value)
        return parseFloat(result)
    }

    formatedValue = () => {
        console.log('formatedValue ' + this.state.edited + ' ' + typeof (this.state.edited))
        if (this.state.edited) {
            return this.state.editTimeValue
        } else {
            return convertNumberToFormattedString(this.props.value)
        }
    }

    render() {
        const { name, onChange, value, calculated, ...restProps } = this.props;
        return (
            <React.Fragment>
                <input type="text" name={name}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onChange={this.onChange}
                    value={this.formatedValue()} {...restProps} />
                //{convertNumberToFormattedString(this.props.value)} {this.setState.edited?'[1]':'[0]'}
            </React.Fragment>
        )
    }
}

export { InputCurrency }