import React, { Component } from 'react'
import { Form, Input, Radio, Button, Label, Icon, Checkbox } from 'semantic-ui-react'
import { Faktura } from '../../modules/Faktura'
import Walidator from'../../modules/Walidator'
//import FirmaSearch from './searchInputs/FirmaSearch'
import FirmaNazwaNip from './searchInputs/FirmaNazwaNip'
//import { InputCurrency } from './InputCurrency'

class FakturaForm extends Component {
    handleChange= (e) => {
        const { name, value } = e.target;
        this.props.onFakturaChange({ [name]: value });
    }
    handleRadioChange = (e, { value, name }) => this.props.onFakturaChange({ [name]: value })
    handleCheckboxChange = (e, data) => {
        //console.log('data: ', data)
        const { name, checked } = data;
        const value = checked ? 1 : 0
        this.props.onFakturaChange({ [name]: value });
    }

    wpiszWartoscKwalfikowana = () => {
        this.props.onFakturaChange({ wartosc_kwalfikowana: this.props.faktura.wartosc_brutto })
    }
    
    formatujPolaFinansowe = () => {
        this.props.onFakturaChange({ wartosc_kwalfikowana: this.props.faktura.wartosc_brutto })
    }

    onBlurWaluta = (evt) => {
        const { name, value } = evt.target
        this.props.onFakturaChange({ [name]: parseFloat(value).toFixed(2) })        
    }

    anulujFakture = () => {
        
    }

    render() {
        const { isLoading, faktura } = this.props
        const sekcjaPrzedplata = faktura.forma_platnosci === '2'
        const sekcjaGotowka = !sekcjaPrzedplata
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
                        <Label>L.p. / Rok budżetowy</Label>
                        <Input id='form-input-lp' placeholder='nadawane po zapisie' disabled
                            name="lp" value={faktura.lp} onChange={this.handleChange}
                        />
                        <Input id='form-input-rok_budzetowy' placeholder='Rok budżetowy' type='number'
                            name="rok_budzetowy" value={faktura.rok_budzetowy} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Firma</Label>
                        {/* <FirmaSearch faktura={faktura} onChange={this.props.onFakturaChange} /> */}
                        <FirmaNazwaNip faktura={faktura} onFakturaChange={this.props.onFakturaChange} />
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
                    {sekcjaGotowka &&
                        <Form.Group widths='equal'>
                            <Label>Nr faktury</Label>
                            <Input id='form-input-nr_faktury' placeholder='Nr faktury'
                                name="nr_faktury" value={faktura.nr_faktury} onChange={this.handleChange}
                            />
                        </Form.Group>}
                    {sekcjaGotowka &&
                        <Form.Group widths='equal'>
                            <Label>Data wystawienia</Label>
                            <Input id='form-input-data_wystawienia' type='date'
                                name="data_wystawienia" value={faktura.data_wystawienia} onChange={this.handleChange}
                            />
                        </Form.Group>}
                   <Form.Group widths='equal'>
                        <Label>Przedmiot</Label>
                        <Input id='form-input-przedmiot' placeholder='Przedmiot' error={Walidator.isBlank(faktura.przedmiot)}
                            name="przedmiot" value={faktura.przedmiot} onChange={this.handleChange} className='podwojna_szerokosc'
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Wartość netto</Label>
                        <Input id='form-input-wartosc_netto' type='number' className='waluta'
                            name="wartosc_netto" value={faktura.wartosc_netto} onChange={this.handleChange} onBlur={this.onBlurWaluta}
                        />
                    </Form.Group>
                    
                    <Form.Group widths='equal'>
                        <Label>Wartość VAT</Label>
                        <Input id='form-input-vat' type='number' className='waluta'
                            name="vat" value={faktura.vat} onChange={this.handleChange} onBlur={this.onBlurWaluta}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Wartość brutto</Label>
                        <Input id='form-input-wartosc_brutto' type='number' disabled className='waluta'
                            name="wartosc_brutto" value={faktura.wartosc_brutto} onChange={this.handleChange}
                        />
                        {/* <InputCurrency name="wartosc_brutto" value={faktura.wartosc_brutto} onChange={this.props.onFakturaChange}
                            className="currency" /> */}

                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Wartość kwalifikowana</Label>
                        <Input id='form-input-wartosc_kwalfikowana' type='number' min="0.01" step="0.01" className='waluta' 
                            name="wartosc_kwalfikowana" value={faktura.wartosc_kwalfikowana} onChange={this.handleChange}
                            error={!faktura.isFieldValid("wartosc_kwalfikowana")}
                        />
                        {
                            faktura.wartosc_brutto > 0
                            &&
                        <Button icon labelPosition='left' type='button'
                            onClick={this.wpiszWartoscKwalfikowana}>
                            <Icon name='arrow left' />
                            {faktura.wartosc_brutto}
                        </Button>
                        }
                    </Form.Group>
                    {sekcjaGotowka &&
                        <Form.Group widths='equal'>
                            <Label>Nr WRD</Label>
                            <Input id='form-input-nr_wrd' placeholder='Nr WRD'
                                name="nr_wrd" onChange={this.handleChange}
                            />
                        </Form.Group>
                    }
                    {sekcjaPrzedplata &&
                        <Form.Group widths='equal'>
                            <Label>Numer pisma</Label>
                            <Input id='form-input-nr_pisma'
                                name="nr_pisma" value={faktura.nr_pisma} onChange={this.handleChange}
                            />
                        </Form.Group>}
                    <Form.Group widths='equal'>
                        <Label>Nr zamówienia</Label>
                        <Input id='form-input-nr_zamowienia' placeholder='Nr zamówienia'
                            name="nr_zamowienia" onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Opis</Label>
                        <Input id='form-input-opis' placeholder='Opis' className='podwojna_szerokosc'
                            name="opis" value={faktura.opis} onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>RMK</Label>
                        <Checkbox name="rmk" value="1"
                            checked={faktura.rmk === 1} onChange={this.handleCheckboxChange} />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Anuluj fakturę</Label>
                        <Button icon onClick={this.anulujFakture} type='button'>
                            <Icon name='minus circle' />
                        </Button>
                    </Form.Group>
                    <Button type='button' color='teal' fluid size='large' disabled={isLoading || !Faktura.isPoprawnaDoZapisu(faktura)}
                        loading={isLoading} onClick={(evt) => this.props.onFakturaSave(faktura)}>Zapisz</Button>

                    {Object.keys(faktura).filter(key => typeof (faktura[key]) !== 'function').map(key => key + ':' + faktura[key] + ', ')}
                </div>
            </React.Fragment>
        )
    }
}

export default FakturaForm