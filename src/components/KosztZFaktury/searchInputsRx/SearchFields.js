import React, { Component } from 'react'
import { Form, Input, Search, Button, Label, Icon } from 'semantic-ui-react'
import _ from 'lodash'
//import DataProvider from '../../../modules/DataProvider'
import ProjektSearch from './ProjektSearch'
import ZadanieSearch from './ZadanieSearch'
import BISearch from './BISearch'
import { SearchContext, SearchContextImplementation } from './SearchContext'

class SearchFields extends Component {
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
    }
    render() {
        const { isLoading, value, results } = this.state
        const { koszt } = this.props
        return (
            <React.Fragment>
                <SearchContext.Provider value={new SearchContextImplementation()} >
                <Form.Group widths='equal'>
                    <Label>Projekt</Label>
                    <SearchContext.Consumer>
                        {searchContext => (
                            <ProjektSearch koszt={koszt} onKosztChange={this.props.onKosztChange}
                                dataProvider={this.props.dataProvider} searchContext={searchContext} />
                        )}
                    </SearchContext.Consumer>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Label>Zadanie</Label>
                    <ZadanieSearch projectId={koszt.id_zlecenie} koszt={koszt} onKosztChange={this.props.onKosztChange}
                        dataProvider={this.props.dataProvider} />
                    <SearchContext.Consumer>
                        {searchContext => (
                            <ZadanieSearch projectId={koszt.id_zlecenie} koszt={koszt} onKosztChange={this.props.onKosztChange}
                                dataProvider={this.props.dataProvider} searchContext={searchContext} />
                        )}
                    </SearchContext.Consumer>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Label>Koszt BI</Label>
                    <BISearch koszt={koszt} onKosztChange={this.props.onKosztChange} dataProvider={this.props.dataProvider} />
                </Form.Group>
                </SearchContext.Provider>
            </React.Fragment>
        )
    }

}

export default SearchFields