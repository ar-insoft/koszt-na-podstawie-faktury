import React, { Component } from 'react'
import { Form, Input, Button, Grid, Container, Header, Label, Tab } from 'semantic-ui-react'
import './KosztZFaktury.css'
import FakturaForm from './FakturaForm'
import KosztForm from './KosztForm'
import { FakturaPusta } from '../../modules/FakturaPusta'
import { KosztyListaTest } from '../../modules/KosztyListaTest'
import { Koszty } from '../../modules/Koszty'
import { Faktura } from '../../modules/Faktura'
class KosztZFaktury extends Component {
    constructor(props) {
        super(props);

        this.state = {
            faktura: { id: -1, }, //FakturaPusta, // 
            koszty: new Koszty([]), // KosztyListaTest
            isLoading: false,
            tabActiveIndex: 0,
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
                            <KosztForm key={koszt.id} koszt={koszt} koszty={this.state.koszty} onKosztChange={this.handleKosztChange}
                                onKosztSave={this.handleKosztSave}
                            />
                        </Tab.Pane> }
                ))
            ,
        // {
        //     menuItem: 'dodaj nowy koszt...', render: () =>
        //         <Tab.Pane>nowy koszt</Tab.Pane>
        // },
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
        let koszty = this.state.koszty.dodajNowyKoszt(this.state.faktura)
        this.setState({ koszty, tabActiveIndex: this.state.koszty.listaKosztow.length });
    }
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    handleTabChange = (e, { activeIndex }) => this.setState({ tabActiveIndex: activeIndex })

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
                                    <Input id='form-input-wartosc_kwalfikowana' placeholder='Wartość kwalifikowana' className='waluta'
                                        name="wartosc_kwalfikowana" value={faktura.wartosc_kwalfikowana} input="readonly='1'"
                                    />
                                </Form.Field>
                                <Form.Field inline>
                                    <Label pointing='right'>Rozliczono</Label>
                                    <Input id='form-input-faktura_rozliczono' className='waluta' input="readonly='1'"
                                        name="faktura_rozliczono" value={this.state.koszty.wartoscKwalfikowanaSuma()}
                                    />
                                </Form.Field>
                                <Form.Field inline>
                                    <Input id='form-input-faktura_pozostalo' label='Pozostało' className='waluta' input="readonly='1'"
                                        name="faktura_pozostalo" value={Faktura.fakturaPozostaloDoRozliczenia(faktura.wartosc_kwalfikowana, this.state.koszty.wartoscKwalfikowanaSuma())}
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
                            {/*  disabled={!Faktura.isFakturaZapisana(faktura)} */}
                        </Grid.Row>
                    </Grid>

                    <Tab panes={this.tabs()} activeIndex={this.state.tabActiveIndex} onTabChange={this.handleTabChange} />
                </Form>
            </Container>
        )

    }
}
            
            
            
export default KosztZFaktury;