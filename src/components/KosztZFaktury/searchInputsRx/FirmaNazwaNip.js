import React, { Component } from 'react'
import { Input } from 'semantic-ui-react'

class FirmaNazwaNip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            results: [],
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.props.onFakturaChange({ [name]: value });
    }

    // componentDidMount() {
    //     if (this.props.faktura.firma && this.state.value !== this.props.faktura.firma.name)
    //         this.setState({ value: this.props.faktura.firma.name })
    // }
    // resetComponent = () => this.setState({ isLoading: false, results: [], })
    // addCompany = () => {
    //     window.open('/eoffice/crm/edm_crm_contact_add_company.xml?action=new&c=' + Math.random(1),
    //         '_blank', 'status=no,menubar=no')
    // }

    // handleResultSelect = (e, { result }) => {
    //     this.props.onChange({ company_id: result.id, firma: result });
    //     this.setState({ value: result.name })
    // }
    // handleSearchChange = (e, { value }) => {
    //     this.setState({ value })

    //     setTimeout(() => {
    //         if (this.state.value.length < 3) return this.resetComponent()
    //         this.setState({ isLoading: true, })
    //         this.fetchFirmyList(value)
    //     }, 300)
    // }

    // fetchFirmyList = (q) => {
    //     console.log('fetchZadaniaList')
    //     const url = '/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=koszty_pwr_szukanie_firmy&q=' + q
    //     fetch(url, {
    //         method: 'get',
    //         headers: { 'Content-Type': 'application/json', },
    //     })
    //         .then(response => {
    //             if (!response.ok) {
    //                 return Promise.reject();
    //             }
    //             return response.json();
    //         })
    //         .then(json => {
    //             this.setState({ isLoading: false, results: json })
    //         })
    // }

    render() {
        //const { isLoading, value, results } = this.state
        const { faktura } = this.props
        return (
            <React.Fragment>
                {/* Nazwa <Search
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                    results={results}
                    value={value}`
                    resultRenderer={resultRenderer}
                /> */}
                <span className='verticalAlignMiddle'>Nazwa</span>          
                <Input id='form-input-firma_nazwa'
                    name="firma_nazwa" value={faktura.firma_nazwa} onChange={this.handleChange}
                />
                <span className='verticalAlignMiddle'>NIP</span>                
                <Input id='form-input-firma_nip' 
                    name="firma_nip" value={faktura.firma_nip} onChange={this.handleChange}
                />
            </React.Fragment>
        )
    }
}

// const resultRenderer = ({ id, name, nip }) => (
//     <div className='content budzety_result' key={id}>
//         {nip && <span className='title'>{nip}</span>}
//         {name && <span className='description'>{name}</span>}
//     </div>
//)

export default FirmaNazwaNip