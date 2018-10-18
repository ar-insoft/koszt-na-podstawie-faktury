import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import _ from 'lodash'

class ZadanieSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            results: [],
        }

    }
    componentDidMount() {
        if (this.props.koszt.zadanie && this.state.value !== this.props.koszt.zadanie.numer)
            this.setState({ value: this.props.koszt.zadanie.numer })
    }
    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => {
        this.props.onKosztChange(this.props.koszt, { koszt_teta_parent_id: result.id, zadanie: result });
        this.setState({ zadanie: result, value: result.numer })
    }
    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = result => re.test(result.title)

            this.fetchZadaniaList()
        }, 300)
    }

    fetchZadaniaList = () => {
        console.log('fetchZadaniaList')
        const url = '/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=koszty_pwr_szukanie_zadania&projectId=' + this.props.projectId
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
            <Search
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                results={results}
                value={value}
                resultRenderer={resultRenderer}
            />
        )
    }
}
const resultRenderer = ({ id, numer, nazwa }) => (
    <div className='content budzety_result' key={id}>
        {numer && <span className='title'>{numer}</span>}
        {nazwa && <span className='description'>{nazwa}</span>}
    </div>
)

export default ZadanieSearch