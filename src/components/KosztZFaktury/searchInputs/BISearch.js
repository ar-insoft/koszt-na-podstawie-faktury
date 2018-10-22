import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import _ from 'lodash'

const biWszystkie = [
    { id: "02110", nieaktywny: "1", numer: "02110", nazwa: "AMORT ŚRODKÓW TRWAŁYCH i WART.NIEMATER. I PRAWNYCH" },
    { id: "02120", nieaktywny: "1", numer: "02120", nazwa: "ŚR.TRW.AMORTYZACJI < 3 500" },
    { id: "02130", nieaktywny: "1", numer: "02130", nazwa: "ŚRODKI TRWAŁE -APARATURA - 100% AMORTYZACJI" },
    { id: "02140", nieaktywny: "1", numer: "02140", nazwa: "AMORT.WART.NIEMATER.I PRAWNYCH <3500" },
    { id: "02150", nieaktywny: "1", numer: "02150", nazwa: "AMORT.WART.NIEMAT.I PRAW. -  100% AMORTYZACJI" },
    { id: "02200", nieaktywny: "1", numer: "02200", nazwa: "ZUŻYCIE MATERIAŁÓW I ENERGII" },
    { id: "02320", nieaktywny: "1", numer: "02320", nazwa: "USŁUGI OBCE" },
    { id: "02330", nieaktywny: "1", numer: "02330", nazwa: "KOOPERACJA BADAWCZA" },
    { id: "02400", nieaktywny: "1", numer: "02400", nazwa: "PODATKI I OPŁATY" },
    { id: "02510", nieaktywny: "1", numer: "02510", nazwa: "WYNAGRODZENIA OSOBOWE" },
    { id: "02520", nieaktywny: "1", numer: "02520", nazwa: "WYNAGRODZENIA BEZOSOBOWE" },
    { id: "02610", nieaktywny: "1", numer: "02610", nazwa: "UBEZPIECZENIA SPOŁECZNE" },
    { id: "02620", nieaktywny: "1", numer: "02620", nazwa: "ODPIS NA ZAKŁADOWY FUNDUSZ SOCJALNY" },
    { id: "02630", nieaktywny: "1", numer: "02630", nazwa: "POZOSTAŁE ŚWIADCZENIA NA RZECZ PRACOW." },
    { id: "02710", nieaktywny: "1", numer: "02710", nazwa: "APARATURA SPECJALNA" },
    { id: "02720", nieaktywny: "1", numer: "02720", nazwa: "PODRÓŻE SŁUŻBOWE" },
    { id: "02740", nieaktywny: "1", numer: "02740", nazwa: "POZOSTAŁE KOSZTY RODZAJOWE" },
    { id: "03000", nieaktywny: "1", numer: "03000", nazwa: "NARZUT KOSZTÓW WYDZIAŁOWYCH" },
    { id: "04000", nieaktywny: "1", numer: "04000", nazwa: "NARZUT KOSZTÓW OGÓLNYCH" },
    { id: "11210", nieaktywny: "1", numer: "11210", nazwa: "KOSZTY Z TYT. USŁUG WEWNĘTRZNYCH" },
    { id: "12400", nieaktywny: "1", numer: "12400", nazwa: "ZAKUPY ŚRODKÓW TRWAŁYCH I WNIP => 3500 ORAZ INWEST" },
    { id: "12500", nieaktywny: "1", numer: "12500", nazwa: "ZAKUPY ŚRODKÓW TRWAŁYCH i WNiP < 3500" },
]
class BISearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        }
    }
    componentDidMount() {
        if (this.props.koszt.bi && this.state.value !== this.props.koszt.bi.numer)
            this.setState({ value: this.props.koszt.bi.numer })
    }
    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => {
        this.props.onKosztChange(this.props.koszt, { koszt_teta_id: result.id, bi: result });
        this.setState({ bi: result, value: result.id })
    }
    handleSearchChange = (e, { value }) => {
        if(!(this.props.koszt.koszt_teta_parent_id > 0)) return
        this.setState({ isLoading: true, value })

        this.fetchBiList()
        // setTimeout(() => {
        //     if (this.state.value.length < 1) return this.resetComponent()

        //     const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
        //     const isMatch = result => re.test(result.title)

        //     this.setState({
        //         isLoading: false,
        //         results: _.filter(BiWszystkie, result => true),
        //     })
        // }, 300)
    }

    fetchBiList = (q) => {
        console.log('fetchBiList')
        const koszt_teta_parent_id = this.props.koszt.koszt_teta_parent_id
        const url = '/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=koszty_pwr_szukanie_bi&koszt_teta_parent_id=' + koszt_teta_parent_id
        fetch(url, {
            method: 'get',
            headers: { 'Content-Type': 'application/json', },
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json();
            })
            .then(json => {
                let bi = json
                let biBrakujace = biWszystkie.filter(el => !bi.includes(el))
                Array.prototype.push.apply(bi, biBrakujace)
                this.setState({ isLoading: false, results: bi })
            })
    }

    render() {
        const { isLoading, value, results } = this.state
        return (
            <React.Fragment>
                <Search
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                    results={results}
                    value={value}
                    resultRenderer={resultRenderer}
                /> {this.props.koszt.bi && this.props.koszt.bi.nieaktywny == "1" && <div className='fontRed'>nieaktywny Teta</div>}
            </React.Fragment>
        )
    }
}
const resultRenderer = ({ id, numer, nazwa, nieaktywny }) => (
    <div key='content' className='content'>
        {numer && <div className='title'>{numer}</div>}
        {nazwa && <div className='description'>{nazwa}</div>}
        {nieaktywny && <div className='fontRed'>nieaktywny Teta</div>}
    </div>
)

export default BISearch