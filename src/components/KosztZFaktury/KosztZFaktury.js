import React, { Component } from 'react'
import { Form, Input, Checkbox, Button, Grid, Container, Header, Label, Search, Tab } from 'semantic-ui-react'
import _ from 'lodash'
import faker from 'faker'
import './KosztZFaktury.css'
import { FakturaPusta } from './FakturaPusta'
import { KosztyListaTest } from './KosztyListaTest'
import { Koszty } from './Koszty'
import ProjektSearch from './ProjektSearch'
import ZadanieSearch from './ZadanieSearch'
import BISearch from './BISearch'

const source = _.times(5, () => ({
    title: faker.company.companyName(),
    description: faker.company.catchPhrase(),
}))
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
                    <Faktura isLoading={this.state.isLoading} faktura={this.state.faktura} onFakturaChange={this.handleFakturaChange}
                    />
                </Tab.Pane>
        },
            ...this.state.koszty.listaKosztow.map(koszt =>
                Object.assign({ menuItem: koszt.opis }, {
                    render: () =>
                        <Tab.Pane>
                            <Koszt koszt={koszt} koszty={this.state.koszty} onKosztChange={this.handleKosztChange}
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
        this.state.koszty.zapiszKoszt(koszt)
            .then(kosztZapisany => {
                //this.setState({ isLoading: false, results: json })
            })
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
                                            <Label >{koszt.wartosc_kwalfikowana}</Label>
                                        </Form.Field>
                                    )
                                }
                            </Grid.Column>
    </Grid.Row>
    </Grid>

                            <Tab panes={this.tabs()} />
                </Form>
            </Container>
                    )
            
                }
            }
            
class Faktura extends Component {
                        constructor(props) {
                    super(props);
                    this.handleFakturaChange = props.onFakturaChange;
            
                    this.handleChange = this.handleChange.bind(this);
                    this.handleFakturaChange = this.handleFakturaChange.bind(this);
            
                }
            
    handleChange(e) {
        const {name, value } = e.target;
                    console.log('name: ' + name + ' value: ' + value)
        this.handleFakturaChange({[name]: value });
                }
            
    render() {
        const {isLoading, faktura } = this.props
                    return (
            <React.Fragment>
                        Dane faktury
            <div className="formElements">
                            <Form.Group widths='equal'>
                                <label>Forma płatności</label>
                                <Form.Radio label='Przelew-gotówka' name='forma_platnosci' value='1'
                                    checked={faktura.forma_platnosci === '1'} onChange={this.handleChange}
                                />
                                <Form.Radio label='Przedpłata' name='forma_platnosci' value='2'
                                    checked={faktura.forma_platnosci === '2'} onChange={this.handleChange}
                                />
                                {/*  
                        <Form.Field>
                        </Form.Field>
                        <Form.Field>
                        </Form.Field>
                        checked={this.state.value === 'that'} onChange={this.handleChange} */}
                            </Form.Group>
                            <Form.Input id='form-input-firma' label='Firma' placeholder='Firma'
                                name="firma"
                            />
                            <Form.Input id='form-input-nr_faktury' label='Nr faktury' placeholder='Nr faktury'
                                name="nr_faktury" value={faktura.nr_faktury} onChange={this.handleChange}
                            />
                            <Form.Input id='form-input-data_wystawienia' label='Data wystawienia' placeholder='Data wystawienia'
                                name="data_wystawienia"
                            />
                            <Form.Input id='form-input-przedmiot' label='Przedmiot' placeholder='Przedmiot'
                                name="przedmiot"
                            />
                            <Form.Input id='form-input-wartosc_netto' label='Wartość netto' placeholder='Wartość netto'
                                name="wartosc_netto"
                            />
                            <Form.Input id='form-input-wartosc_brutto' label='Wartość brutto' placeholder='Wartość brutto'
                                name="wartosc_brutto"
                            />
                            <Form.Input id='form-input-wartosc_kwalfikowana' label='Wartość kwalifikowana' placeholder='Wartość kwalifikowana'
                                name="wartosc_kwalfikowana" value={faktura.wartosc_kwalfikowana} onChange={this.handleChange}
                            />
                            <Form.Input id='form-input-nr_wdr' label='Nr WRD' placeholder='Nr WRD'
                                name="nr_wdr"
                            />
                            <Form.Input id='form-input-nr_zamowienia' label='Nr zamówienia' placeholder='Nr zamówienia'
                                name="nr_zamowienia"
                            />
                            <Form.Input id='form-input-opis' label='Opis' placeholder='Opis'
                                name="opis"
                            />
                                <Button color='teal' fluid size='large' loading={isLoading} disabled={isLoading}
                                    onClick={(evt) => this.handleSave(evt)}>Zapisz</Button>


                            Forma płatności	✓	1 	Przelew-gotówka Przedpłata
                            Przedpłata  - rejestracja kosztu, którego jeszcze nie ma, powoduje rezerwację środków (wyświetla wartość na czerwono)
                            Firma	✓	2
                            Nr faktury	✓	3	Nie wymagane dla formy: przedpłata
                            Data wystawienia	✓	4
                            Przedmiot	✓	5
                            Wartość netto	✓	6
                            Wartość brutto	✓	7
                            Wartość kwalifikowana	✓	8	Wartość do rozpisania na koszty
                            Nr WRD	✓	9	Pole kluczowe - unikalne
                            Nr zamówienia	-	10
                            Opis, dotyczy
        
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
        const { isLoading, value, results } = this.state
        const { projekt, projectSearchEdit, projectSearchResults } = this.state
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
                            name="opis" value={koszt.opis}
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