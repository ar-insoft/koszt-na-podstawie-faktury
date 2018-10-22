import React, { Component } from 'react'
import { Form, Input, Radio, Button, Label } from 'semantic-ui-react'
import { Faktura } from '../../modules/Faktura'
import FirmaSearch from './searchInputs/FirmaSearch'
import { InputCurrency } from './InputCurrency'

class FakturaForm extends Component {
    constructor(props) {
        super(props);
    }

    handleChange= (e) => {
        const { name, value } = e.target;
        this.props.onFakturaChange({ [name]: value });
    }
    handleRadioChange = (e, { value, name }) => this.props.onFakturaChange({ [name]: value })

    render() {
        const { isLoading, faktura } = this.props
        return (
            <React.Fragment>
                Dane faktury
            <div className="formElements">
                    <Form.Group widths='equal'>
                        <Label>Forma płatności</Label>
                        <Radio label='Przelew-gotówka' name='forma_platnosci' value='1'
                            checked={faktura.forma_platnosci === '1'} onChange={this.handleRadioChange}
                        />
                        <Radio label='Przedpłata' name='forma_platnosci' value='2'
                            checked={faktura.forma_platnosci === '2'} onChange={this.handleRadioChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Firma</Label>
                        <FirmaSearch faktura={faktura} onChange={this.props.onFakturaChange} />
                    </Form.Group>
                    {/* <Grid columns={2} stackable>
                        <Grid.Column>
                            <Form.Group widths='equal'>
                                <Label>Nr faktury</Label>
                                <Input id='form-input-nr_faktury' placeholder='Nr faktury'
                                    name="nr_faktury" value={faktura.nr_faktury} onChange={this.handleChange}
                                />
                            </Form.Group>
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Group widths='equal'>
                                <Label>Data wystawienia</Label>
                                <Input id='form-input-data_wystawienia' type='date'
                                    name="data_wystawienia" value={faktura.data_wystawienia} onChange={this.handleChange}
                                />
                            </Form.Group>
                        </Grid.Column>
                    </Grid> */}
                    <Form.Group widths='equal'>
                        <Label>Nr faktury</Label>
                        <Input id='form-input-nr_faktury' placeholder='Nr faktury'
                            name="nr_faktury" value={faktura.nr_faktury} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Data wystawienia</Label>
                        <Input id='form-input-data_wystawienia' type='date'
                            name="data_wystawienia" value={faktura.data_wystawienia} onChange={this.handleChange}
                        />
                    </Form.Group>
                   <Form.Group widths='equal'>
                        <Label>Przedmiot</Label>
                        <Input id='form-input-przedmiot' placeholder='Przedmiot'
                            name="przedmiot" value={faktura.przedmiot} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Wartość netto</Label>
                        <Input id='form-input-wartosc_netto' type='number'
                            name="wartosc_netto" value={faktura.wartosc_netto} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Wartość brutto</Label>
                        <Input id='form-input-wartosc_brutto' type='number'
                            name="wartosc_brutto" value={faktura.wartosc_brutto} onChange={this.handleChange}
                        />
                        <InputCurrency name="wartosc_brutto" value={faktura.wartosc_brutto} onChange={this.props.onFakturaChange}
                            className="currency" />

                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Wartość kwalifikowana</Label>
                        <Input id='form-input-wartosc_kwalfikowana' type='number' min="0.01" step="0.01"
                            name="wartosc_kwalfikowana" value={faktura.wartosc_kwalfikowana} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Nr WRD</Label>
                        <Input id='form-input-nr_wrd' placeholder='Nr WRD'
                            name="nr_wrd" onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Nr zamówienia</Label>
                        <Input id='form-input-nr_zamowienia' placeholder='Nr zamówienia'
                            name="nr_zamowienia" onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Opis</Label>
                        <Input id='form-input-opis' placeholder='Opis'
                            name="opis" value={faktura.opis} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Button color='teal' fluid size='large' disabled={isLoading || !Faktura.isPoprawnaDoZapisu(faktura)}
                        loading={isLoading} onClick={(evt) => this.props.onFakturaSave(faktura)}>Zapisz</Button>

                    {/* {Object.keys(faktura).map(key => key + ':' + faktura[key] + ', ')} 
                    {Faktura.isPoprawnaDoZapisu(faktura).toString()} */}
                </div>
            </React.Fragment>
        )
    }
}

export default FakturaForm