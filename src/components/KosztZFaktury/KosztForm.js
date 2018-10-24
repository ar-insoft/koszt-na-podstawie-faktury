import React, { Component } from 'react'
import { Form, Input, Checkbox, Button, Label } from 'semantic-ui-react'
import ProjektSearch from './searchInputs/ProjektSearch'
import ZadanieSearch from './searchInputs/ZadanieSearch'
import BISearch from './searchInputs/BISearch'
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
        //console.log('name: ' + name + ' value: ' + value)

        if (type === "number") {
            value = parseFloat(value)
        }
        this.props.onKosztChange(this.props.koszt, { [name]: value });
    }
    handleCheckboxChange = (e, data) => {
        console.log('data: ', data)
        const { name, checked } = data;
        const value = checked ? 1 : 0
        this.props.onKosztChange(this.props.koszt, { [name]: value });
    }

    render() {
        const { isLoading } = this.state
        const { koszt } = this.props
        return (
            <React.Fragment>
                Dane kosztu
            <div className="formElements">
                    <Form.Group widths='equal'>
                        <Label>Rezerwacja</Label>
                        <Checkbox name="rezerwacja" value="1"
                            checked={koszt.rezerwacja === 1} onChange={this.handleCheckboxChange} />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Projekt</Label>
                        <ProjektSearch koszt={koszt} onKosztChange={this.props.onKosztChange} />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Zadanie</Label>
                        <ZadanieSearch projectId={koszt.id_zlecenie} koszt={koszt} onKosztChange={this.props.onKosztChange} />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Koszt BI</Label>
                        <BISearch koszt={koszt} onKosztChange={this.props.onKosztChange} />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Wartość netto</Label>
                        <Input id='form-input-wartosc_netto' type="number"
                            name="real_value" value={koszt.real_value} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Wartość VAT kwalifikowany</Label>
                        <Input id='form-input-wartosc_vat_kwalfikowany' type="number"
                            name="vat_value" value={koszt.vat_value} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Wartość kwalifikowana</Label>
                        <Input id='form-input-wartosc_kwalfikowana' type="number"
                            name="kwota_obciazajaca_budzet" value={koszt.kwota_obciazajaca_budzet} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Opis</Label>
                        <Input id='form-input-opis' placeholder='Opis'
                            name="opis" value={koszt.opis} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Button color='teal' fluid size='large' loading={isLoading} disabled={isLoading}
                        onClick={(evt) => this.props.onKosztSave(koszt)}>Zapisz</Button>

                    {/* {Object.keys(koszt).map(key => key + ':' + koszt[key] + ', ')} */}
                </div>
            </React.Fragment>
        )
    }
}

export default KosztForm