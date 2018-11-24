import React, { Component } from 'react'
import { Form, Input, Search, Button, Label, Icon } from 'semantic-ui-react'
import _ from 'lodash'
//import DataProvider from '../../../modules/DataProvider'
import ProjektSearch from './searchInputs/ProjektSearch'
import ZadanieSearch from './searchInputs/ZadanieSearch'
import BISearch from './searchInputs/BISearch'

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
                <Form.Group widths='equal'>
                    <Label>Projekt</Label>
                    <ProjektSearch koszt={koszt} onKosztChange={this.props.onKosztChange} dataProvider={this.props.dataProvider} />
                </Form.Group>
                <Form.Group widths='equal'>
                    <Label>Zadanie</Label>
                    <ZadanieSearch projectId={koszt.id_zlecenie} koszt={koszt} onKosztChange={this.props.onKosztChange}
                        dataProvider={this.props.dataProvider} />
                </Form.Group>
                <Form.Group widths='equal'>
                    <Label>Koszt BI</Label>
                    <BISearch koszt={koszt} onKosztChange={this.props.onKosztChange} dataProvider={this.props.dataProvider} />
                </Form.Group>
            </React.Fragment>
        )
    }

}

export default SearchFields