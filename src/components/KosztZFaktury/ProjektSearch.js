import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import _ from 'lodash'

class ProjektSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projekt: {},
            isLoading: false,
        }

    }
    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })
    handleResultSelect = (e, { result }) => {
        this.props.onKosztChange(this.props.koszt, { id_zlecenie: result.id, projekt: result });
        this.setState({ value: result.object_index + ' ' + result.object_external_index })
    }
    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()

            this.fetchList(value)
        }, 300)
    }
    fetchList = (value) => {
        console.log('fetchProjectList')
        const url = '/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=koszty_pwr_szukanie_projektu'
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
                //const projectList = json
                const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
                const isMatch = result => re.test(result.title) || re.test(result.object_index) || re.test(result.object_external_index)
                this.setState({ isLoading: false, results: _.filter(json, isMatch) })
            })

    }

    handleProjektResultSelect = (e, { result }) => {
        this.props.onKosztChange(this.props.koszt, { id_zlecenie: result.id });
        this.setState({ projekt: result, projectSearchEdit: result.title, })
    }
    handleProjektSearchChange = (e, { value }) => {
        console.log('handleProjektSearchChange')
        this.setState({ isLoading: true, projectSearchEdit: value })

        setTimeout(() => {
            console.log('handleProjektSearchChange.setTimeout ' + this.state.projectSearchEdit.length)
            if (this.state.projectSearchEdit.length < 1) return this.resetComponent()

            const re = new RegExp(_.escapeRegExp(this.state.projectSearchEdit), 'i')
            const isMatch = result => re.test(result.title)

            this.fetchProjectList(re, isMatch)

            // this.setState({
            //     isLoading: false,
            //     projectSearchResults: this.fetchProjectList().slice(1, 3), //_.filter(this.fetchProjectList(), result => 1 === 1).slice(1, 3),
            // })
        }, 300)
    }

    fakeProjectSource = _.times(5, () => ({
        "surname": "BORATYŃSKI",
        "object_index": "013N\/0001\/13",
        "id": 55855,
        "title": "AMpHOra 013N\/0001\/13",
        "katedra": "KATEDRA TECHNOLOGII LASEROWYCH, AUTOMATYZACJI I ORGANIZACJI PRODUKCJI W10\/K3"
    }))

    fetchProjectList = (re, isMatch) => {
        console.log('fetchProjectList')
        const url = '/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=koszty_pwr_szukanie_projektu'
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
                //const projectList = json
                this.setState({ isLoading: false, projectSearchResults: _.filter(json, isMatch) })
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
const resultRenderer = ({ id, title, object_index, object_external_index }) => (
    <div key='content' className='content budzety_result'>
        {object_index && <span className='title'>{object_index}</span>}
        {object_external_index && <span className='title'>{object_external_index}</span>}
        {title && <span className='description'>{title}</span>}
    </div>
)

export default ProjektSearch