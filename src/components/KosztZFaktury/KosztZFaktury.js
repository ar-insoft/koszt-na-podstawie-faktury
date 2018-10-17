import React, { Component } from 'react'
import { Form, Input, Checkbox, Radio, Button, Grid, Container, Header, Label, Tab } from 'semantic-ui-react'
import './KosztZFaktury.css'
import { FakturaPusta } from './FakturaPusta'
import { KosztyListaTest } from './KosztyListaTest'
import { Koszty } from './Koszty'
import { Faktura } from './Faktura'
import FirmaSearch from './FirmaSearch'
import ProjektSearch from './ProjektSearch'
import ZadanieSearch from './ZadanieSearch'
import BISearch from './BISearch'

class KosztZFaktury extends Component {
    constructor(props) {
        super(props);

        this.state = {
            faktura: FakturaPusta, //{}
            koszty: new Koszty(KosztyListaTest), //[]
            isLoading: false,

        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    componentDidMount() {
    }

    tabs = () => [
        {
            menuItem: 'Faktura', render: () =>
                <Tab.Pane>
                    <FakturaForm isLoading={this.state.isLoading} faktura={this.state.faktura} onFakturaChange={this.handleFakturaChange}
                        onFakturaSave={this.handleFakturaSave}
                    />
                </Tab.Pane>
        },
            ...this.state.koszty.listaKosztow.map(koszt =>
                Object.assign({ menuItem: koszt.opis }, {
                    render: () =>
                        <Tab.Pane>
                            <Koszt key={koszt.id} koszt={koszt} koszty={this.state.koszty} onKosztChange={this.handleKosztChange}
                                onKosztSave={this.handleKosztSave}
                            />
                        </Tab.Pane> }
                ))
            ,
        {
            menuItem: 'dodaj nowy koszt...', render: () =>
                <Tab.Pane>nowy koszt</Tab.Pane>
        },
    ]

    handleFakturaChange = (changes) => {
        console.log('KosztZFaktury.handleFakturaChange', changes)
        let faktura = Object.assign({ ...this.state.faktura }, changes);
        this.setState({ faktura });
    }

    handleKosztChange = (koszt, changes) => {
        let koszty = this.state.koszty.aktualizujPoleKosztu(koszt, changes)
        this.setState({ koszty });
    }

    handleKosztSave = (koszt) => {
        this.state.koszty.zapiszKoszt(koszt, koszty => {
                this.setState({ koszty });
            })
    }

    handleFakturaSave = (faktura) => {
        Faktura.save(faktura, fakturaZapisana => {
            this.setState({ faktura: fakturaZapisana });
        })
    }

    nowyKoszt = () => {
        let koszty = this.state.koszty.dodajNowyKoszt()
        this.setState({ koszty });
    }
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        const { faktura } = this.state;

        return (
            <Container textAlign='center'>
                <Form>
                    <Header as='h2'>Rozliczenie kosztów na podstawie faktury</Header>
                    <Grid columns={2} divided>
                        <Grid.Row>
                            <Grid.Column textAlign='right'>
                                <Form.Field inline>
                                    <Label pointing='right'>Wartość kwalifikowana</Label>
                                    <Input id='form-input-wartosc_kwalfikowana' placeholder='Wartość kwalifikowana'
                                        name="wartosc_kwalfikowana" value={faktura.wartosc_kwalfikowana}
                                    />
                                </Form.Field>
                                <Form.Field inline>
                                    <Label pointing='right'>Rozliczono</Label>
                                    <Input id='form-input-faktura_rozliczono'
                                        name="faktura_rozliczono" value={this.state.koszty.wartoscKwalfikowanaSuma()}
                                    />
                                </Form.Field>
                                <Form.Field inline>
                                    <Input id='form-input-faktura_pozostalo' label='Pozostało'
                                        name="faktura_pozostalo" value={faktura.wartosc_kwalfikowana - this.state.koszty.wartoscKwalfikowanaSuma()}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column>
                                {
                                    this.state.koszty.listaKosztow.map(koszt =>
                                        <Form.Field inline key={koszt.id}>
                                            <Label pointing='right'>{koszt.opis}</Label>
                                            <Label >{koszt.kwota_obciazajaca_budzet}</Label>
                                        </Form.Field>
                                    )
                                }
                                <Button color='teal'
                                    onClick={(evt) => this.nowyKoszt()}>Nowy koszt</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Tab panes={this.tabs()} />
                </Form>
            </Container>
        )

    }
}
            
class FakturaForm extends Component {
                        constructor(props) {
                    super(props);
                    this.handleFakturaChange = props.onFakturaChange;
            
                    this.handleChange = this.handleChange.bind(this);
                    this.handleFakturaChange = this.handleFakturaChange.bind(this);
            
                }
            
    handleChange(e) {
        const {name, value } = e.target;
                    console.log('name: ' + name + ' value: ' + value)
        this.props.onFakturaChange({[name]: value });
    }
    handleRadioChange = (e, { value, name }) => this.props.onFakturaChange({ [name]: value })
            
    render() {
        const {isLoading, faktura } = this.props
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
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Label>Wartość kwalifikowana</Label>
                        <Input id='form-input-wartosc_kwalfikowana' type='number'
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
                    <Button color='teal' fluid size='large' loading={isLoading} disabled={isLoading}
                        onClick={(evt) => this.props.onFakturaSave(faktura)}>Zapisz</Button>

                    {Object.keys(faktura).map(key => key + ':' + faktura[key] + ', ')}
                </div>
            </React.Fragment>
        )
    }
        
}
            
class Koszt extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //projekt: {},
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

                    {Object.keys(koszt).map(key => key + ':' + koszt[key] + ', ')}

                </div>
            </React.Fragment>
        )
    }
}
            
export default KosztZFaktury;