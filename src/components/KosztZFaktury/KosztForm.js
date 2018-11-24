import React, { Component } from 'react'
import { Form, Input, Checkbox, Button, Label } from 'semantic-ui-react'
import ProjektSearch from './searchInputs/ProjektSearch'
import ZadanieSearch from './searchInputs/ZadanieSearch'
import BISearch from './searchInputs/BISearch'
import SearchFields from './SearchFields'
import { SearchContext, SearchContextImplementation } from './searchInputs/SearchContext'

class KosztForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
    }
    componentWillMount() {
    }

    handleChange = (e) => {
        const { name, type } = e.target;
        let { value } = e.target;

        if (type === "number") {
            value = parseFloat(value)
        }
        this.props.onKosztChange(this.props.koszt, { [name]: value });
    }
    handleCheckboxChange = (e, data) => {
        //console.log('data: ', data)
        const { name, checked } = data;
        const value = checked ? 1 : 0
        this.props.onKosztChange(this.props.koszt, { [name]: value });
    }

    render() {
        const { isLoading } = this.state
        const { koszt } = this.props
        return (
            <React.Fragment>
                <SearchContext.Provider value={new SearchContextImplementation()} >
                Dane kosztu
                <div className="formElements">
                    <Form.Group widths='equal'>
                        <Label>Rezerwacja</Label>
                        <Checkbox name="rezerwacja" value="1"
                            checked={koszt.rezerwacja === 1} onChange={this.handleCheckboxChange} />
                    </Form.Group>
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
                    <SearchFields koszt={koszt} onKosztChange={this.props.onKosztChange}/>
                    <Form.Group widths='equal'>
                        <Label>Wartość netto</Label>
                        <Input id='form-input-wartosc_netto' type="number" className='waluta'
                            name="real_value" value={koszt.real_value} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Wartość VAT kwalifikowany</Label>
                        <Input id='form-input-wartosc_vat_kwalfikowany' type="number" className='waluta'
                            name="vat_value" value={koszt.vat_value} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Wartość kwalifikowana</Label>
                        <Input id='form-input-wartosc_kwalfikowana' type="number" className='waluta'
                            name="kwota_obciazajaca_budzet" value={koszt.kwota_obciazajaca_budzet} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Rok budżetowy</Label>
                        <Input id='form-input-rok_budzetowy' placeholder='Rok budżetowy'
                            name="rok_budzetowy" value={koszt.rok_budzetowy} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Opis</Label>
                        <Input id='form-input-opis' placeholder='Opis'
                            name="opis" value={koszt.opis} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Button type='button' color='teal' fluid size='large' loading={isLoading} disabled={isLoading}
                        onClick={(evt) => this.props.onKosztSave(koszt)}>Zapisz</Button>

                    {Object.keys(koszt).filter(key => typeof(koszt[key]) !== 'function').map(key => key + ':' + koszt[key] + ', ')}
                    </div>
                    </SearchContext.Provider>
            </React.Fragment>
        )
    }
}

export default KosztForm