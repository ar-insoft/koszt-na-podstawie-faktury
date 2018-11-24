import React, { Component } from 'react'
import { Search, Button, Icon } from 'semantic-ui-react'
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
        if (this.props.koszt.zadanie && this.state.value !== this.props.koszt.zadanie.nazwa)
            this.setState({ value: this.props.koszt.zadanie.nazwa })
    }
    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => {
        this.props.onKosztChange(this.props.koszt, { koszt_teta_parent_id: result.id, zadanie: result });
        this.setState({ zadanie: result, value: result.nazwa })
    }
    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            // eslint-disable-next-line
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

    handleUsunWybor = () => {
        this.props.koszt.usunWyborZadania()
        this.props.onKosztChange(this.props.koszt, {})
    }

    render() {
        const { isLoading, value, results } = this.state
        console.log('this.props.searchContext', this.props.searchContext)
        return (
            <React.Fragment>
            <Search
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                results={results}
                value={value}
                resultRenderer={resultRenderer}
                />
                {/* <Button icon onClick={this.handleSearchButton}>
                    <Icon name='search' />
                </Button> */}
                {this.props.searchContext && this.props.searchContext.fromContext()}
                <ZadanieInfo zadanie={this.props.koszt.zadanie} handleUsunWybor={this.handleUsunWybor} />
            </React.Fragment>
         )
    }
}
const resultRenderer = ({ id, numer, nazwa }) => (
    <div className='content budzety_result' key={id}>
        {numer && <span className='title'>{numer}</span>}
        {nazwa && <span className='description'>{nazwa}</span>}
    </div>
)

const ZadanieInfo = (props) => {
    if (props.zadanie) {
        return <React.Fragment>
            <div className='project_info'>
                <span className='project_info_title'>{props.zadanie.numer}</span>
                {props.zadanie.nazwa}
            </div>
            <Button icon onClick={props.handleUsunWybor} type='button'>
                <Icon name='delete' />
            </Button>
        </React.Fragment>
    }
    return <div className='project_info'>Nie wybrano zadania</div>
}

export default ZadanieSearch