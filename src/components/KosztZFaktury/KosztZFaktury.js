import React, { Component } from 'react'
import { Form, Input, Button, Grid, Container, Header, Label, Icon, Tab, Menu } from 'semantic-ui-react'
import { toast } from 'react-toastify'
import './KosztZFaktury.css'
import FakturaForm from './FakturaForm'
import KosztForm from './KosztForm'
import KosztyListaForm from './KosztyListaForm'
import { FakturaPusta } from '../../modules/FakturaPusta'
import { KosztyListaTest } from '../../modules/KosztyListaTest'
import { Koszty } from '../../modules/Koszty'
import { Faktura } from '../../modules/Faktura'
class KosztZFaktury extends Component {
    constructor(props) {
        super(props);

        this.state = {
            faktura: new Faktura(), //{ id: -1, }, 
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
                    <FakturaForm key='faktura' isLoading={this.state.isLoading} faktura={this.state.faktura}
                        onFakturaChange={this.handleFakturaChange} onFakturaSave={this.handleFakturaSave}
                    />
                </Tab.Pane>
        },
        ...this.state.koszty.listaKosztow.map((koszt, index) => {
            return ({
                menuItem: 'Koszt ' + (index + 1),
                render: () =>
                    <Tab.Pane>
                        <KosztForm key={koszt.id} koszt={koszt} koszty={this.state.koszty} onKosztChange={this.handleKosztChange}
                            onKosztSave={this.handleKosztSave}
                        />
                        <KosztyListaForm koszty={this.state.koszty} />
                    </Tab.Pane>
            })
        }),
        {
            menuItem: (
                <Menu.Item key='dodaj_koszt'>
                    <Button color='teal' icon labelPosition='left' type='button'
                        onClick={this.nowyKoszt}>
                        <Icon name='add circle' />
                        Dodaj koszt
                    </Button>
                        {/*  disabled={!Faktura.isFakturaZapisana(this.state.faktura)} */}
                </Menu.Item>
            ),
            render: () =>
                <Tab.Pane>
                    Dodaj koszt
                </Tab.Pane>
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
            toast.success(<ToastMessage message={<span><em>Koszt zosał zapisany</em></span>} />);
        })
    }

    handleFakturaSave = (faktura) => {
        Faktura.save(faktura, fakturaZapisana => {
            this.setState({ faktura: fakturaZapisana });
            toast.success(<ToastMessage message={<span><em>Faktura zosała zapisana</em></span>} />);
        })
    }

    nowyKoszt = (evt, data) => {
        //if (evt.detail === 0) { // Fix buga: naciśnięcie Enter w Edit wywołuje ten handler
        //    return;
        //}
        console.log('KosztZFaktury.nowyKoszt', evt, data)
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
                                    <Input id='form-input-faktura_pozostalo' label='Pozostało' className='waluta bold' input="readonly='1'"
                                        name="faktura_pozostalo" value={Faktura.fakturaPozostaloDoRozliczenia(faktura.wartosc_kwalfikowana, this.state.koszty.wartoscKwalfikowanaSuma())}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            {/* <Grid.Column>
                                {
                                    this.state.koszty.listaKosztow.map(koszt =>
                                        <Form.Field inline key={koszt.id}>
                                            <Label pointing='right'>{koszt.opis}</Label>
                                            <Label >{koszt.kwota_obciazajaca_budzet}</Label>
                                        </Form.Field>
                                    )
                                }
                                <Button color='teal' disabled={!Faktura.isFakturaZapisana(faktura)}
                                    onClick={(evt) => this.nowyKoszt()}>Nowy koszt</Button>
                            </Grid.Column> */}
                        </Grid.Row>
                    </Grid>

                    <Tab panes={this.tabs()} activeIndex={this.state.tabActiveIndex} onTabChange={this.handleTabChange} />
                </Form>
            </Container>
        )

    }
}
            
const ToastMessage = (props) => (
    <div>
        {props.message || ''}
    </div>
)            
            
export default KosztZFaktury;