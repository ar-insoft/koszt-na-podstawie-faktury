import React, { Component } from 'react'
import { Search, Button, Icon } from 'semantic-ui-react'
import _ from 'lodash'
import DataProvider from '../../../modules/DataProvider'

class ProjektSearch extends Component {
    constructor(props) {
        super(props);

        let value = props.projekt ? props.projekt.object_index : ''
        this.state = {
            isLoading: false,
            value,
        }
        this.searchRef = React.createRef()
    }
    componentDidMount() {
        //console.log('ProjektSearch.componentDidMount', this.props.koszt.projekt)
        if (this.props.koszt.projekt && this.state.value !== this.props.koszt.projekt.object_index)
            this.setState({ value: this.props.koszt.projekt.object_index })
        
        // this.props.dataProvider.projectListObservable.subscribe((x) => {
        //     console.log('got value ', x)
        // })
        // this.props.dataProvider.projectListObservable.subscribe((x) => {
        //     console.log('got again ', x)
        // })
        //this.setState({ isLoading: false, results: _.filter(projectList, isMatch) })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('ProjektSearch.componentDidUpdate ' + !(this.props.koszt.id_zlecenie > 0) + ' / ' + (prevProps.koszt.id_zlecenie > 0) +' / '+
            (!(this.props.koszt.id_zlecenie > 0) && (prevProps.koszt.id_zlecenie > 0)) + ' / ' +
            this.props.koszt.id_zlecenie + ' : ' + prevProps.koszt.id_zlecenie)
        console.log(snapshot)
        if (!(this.props.koszt.id_zlecenie > 0) && (prevProps.koszt.id_zlecenie > 0)) {
            this.setState({ value: '' })
        }
    }

    //resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })
    handleResultSelect = (e, { result }) => {
        this.props.onKosztChange(this.props.koszt, { id_zlecenie: result.id, projekt: result });
        this.setState({ value: result.object_index }) // + ' ' + result.object_external_index 
    }
    handleSearchButton = (e, data) => {
        console.log(this.searchRef.current)
        this.handleSearchChange(e, { value: '' })
        this.searchRef.current.handleFocus()
    }
    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            //if (this.state.value.length < 1) return this.resetComponent()

            //this.fetchList(value)
            DataProvider.processRequest(DataProvider.projectListPromise(), projectList => this.setResultList(projectList, value))

            //this.props.dataProvider.projectListObservable.subscribe((obs) => {
                //DataProvider.processObservable(obs, projectList => this.setResultList(projectList, value))
            //})

            //this.props.dataProvider.projectListObservable.subscribe(projectList => this.setResultList(projectList, value))
            
        }, 300)
    }
    fetchList = (value) => {
        // console.log('fetchProjectList "' + value + '"')
        // DataProvider.projectListPromise()
        //     .then(response => {
        //         if (!response.ok) {
        //             return Promise.reject();
        //         }
        //         return response.json();
        //     })
        //     .then(json => {
        //         const projectList = json
        //         this.setResultList(projectList, value)
        //     })
        
        DataProvider.processRequest(DataProvider.projectListPromise(), projectList => this.setResultList(projectList, value))
    }
    setResultList = (projectList, filterText) => {
        const re = new RegExp(_.escapeRegExp(filterText), 'i')
        const isMatch = project => filterText === '' ||
            re.test(project.title) || re.test(project.object_index) || re.test(project.object_external_index)
        this.setState({ isLoading: false, results: _.filter(projectList, isMatch) })
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
        "object_index": "013N/0001/13",
        "id": 55855,
        "title": "AMpHOra 013N/0001/13",
        "katedra": "KATEDRA TECHNOLOGII LASEROWYCH, AUTOMATYZACJI I ORGANIZACJI PRODUKCJI W10/K3"
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

    handleUsunWybor = () => {
        this.props.koszt.usunWyborProjektu()
        this.props.onKosztChange(this.props.koszt, {})
    }

    render() {
        const { isLoading, value, results } = this.state
        if (this.props.searchContext) {
            this.props.searchContext.info = 'from project'
        }
        return (
            <React.Fragment>

            <Search
                loading={isLoading} icon=''
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                results={results}
                value={value}
                    resultRenderer={resultRenderer}
                    ref={this.searchRef}
                />
                {/* <Button icon onClick={this.handleSearchButton} type='button'>
                    <Icon name='search' />
                </Button> */}

                <ProjectInfo projekt={this.props.koszt.projekt} handleUsunWybor={this.handleUsunWybor} />
                </React.Fragment>
        )
    }
}
const resultRenderer = ({ title, object_index, object_external_index }) => (
    <div key='content' className='content budzety_result'>
        {object_index && <span className='title'>{object_index}</span>}
        {object_external_index && <span className='title'>{object_external_index}</span>}
        {title && <span className='description'>{title}</span>}
    </div>
)

const ProjectInfo = (props) => {
    if (props.projekt) {
        return <React.Fragment>
            <div className='project_info'>
                <span className='project_info_title'>{props.projekt.object_index}</span>
                <span className='project_info_title'>{props.projekt.object_external_index}</span>
                {props.projekt.title}
            </div>
            <Button icon onClick={props.handleUsunWybor} type='button'>
                <Icon name='delete' />
            </Button>
        </React.Fragment>
    }
    return <div className='project_info'>Nie wybrano projektu</div>
}

export default ProjektSearch