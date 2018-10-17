import React, { Component } from 'react'
import { Search, Button, Icon } from 'semantic-ui-react'
import _ from 'lodash'

class FirmaSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            results: [],
        }
    }
    componentDidMount() {
        if (this.props.faktura.firma && this.state.value !== this.props.faktura.firma.name)
            this.setState({ value: this.props.faktura.firma.name })
    }
    resetComponent = () => this.setState({ isLoading: false, results: [], })
    addCompany = () => {
        window.open('/eoffice/crm/edm_crm_contact_add_company.xml?action=new&c=' + Math.random(1),
            '_blank', 'status=no,menubar=no')
    }

    handleResultSelect = (e, { result }) => {
        this.props.onChange({ company_id: result.id, firma: result });
        this.setState({ value: result.name })
    }
    handleSearchChange = (e, { value }) => {
        this.setState({ value })

        setTimeout(() => {
            if (this.state.value.length < 3) return this.resetComponent()
            this.setState({ isLoading: true, })
            this.fetchFirmyList(value)
        }, 300)
    }

    fetchFirmyList = (q) => {
        console.log('fetchZadaniaList')
        const url = '/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=koszty_pwr_szukanie_firmy&q=' + q
        fetch(url, {
            method: 'get',
            headers: { 'Content-Type': 'application/json', },
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json();
            })
            .then(json => {
                this.setState({ isLoading: false, results: json })
            })
    }

    render() {
        const { isLoading, value, results } = this.state
        return (
            <React.Fragment>
                <Search
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                    results={results}
                    value={value}
                    resultRenderer={resultRenderer}
                    minCharacters={3}
                />
                <Button icon onClick={this.addCompany}>
                    <Icon name='plus circle' />
                </Button>
            </React.Fragment>
        )
    }
}
const resultRenderer = ({ id, name, nip }) => (
    <div className='content budzety_result' key={id}>
        {nip && <span className='title'>{nip}</span>}
        {name && <span className='description'>{name}</span>}
    </div>
)

export default FirmaSearch