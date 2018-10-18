import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import _ from 'lodash'

const BiWszystkie = [
    { koszt_teta_id: "02110", koszt_teta_name: "AMORT ŚRODKÓW TRWAŁYCH i WART.NIEMATER. I PRAWNYCH" },
    { koszt_teta_id: "02120", koszt_teta_name: "ŚR.TRW.AMORTYZACJI < 3 500" },
    { koszt_teta_id: "02130", koszt_teta_name: "ŚRODKI TRWAŁE -APARATURA - 100% AMORTYZACJI" },
    { koszt_teta_id: "02140", koszt_teta_name: "AMORT.WART.NIEMATER.I PRAWNYCH <3500" },
    { koszt_teta_id: "02150", koszt_teta_name: "AMORT.WART.NIEMAT.I PRAW. -  100% AMORTYZACJI" },
    { koszt_teta_id: "02200", koszt_teta_name: "ZUŻYCIE MATERIAŁÓW I ENERGII" },
    { koszt_teta_id: "02320", koszt_teta_name: "USŁUGI OBCE" },
    { koszt_teta_id: "02330", koszt_teta_name: "KOOPERACJA BADAWCZA" },
    { koszt_teta_id: "02400", koszt_teta_name: "PODATKI I OPŁATY" },
    { koszt_teta_id: "02510", koszt_teta_name: "WYNAGRODZENIA OSOBOWE" },
    { koszt_teta_id: "02520", koszt_teta_name: "WYNAGRODZENIA BEZOSOBOWE" },
    { koszt_teta_id: "02610", koszt_teta_name: "UBEZPIECZENIA SPOŁECZNE" },
    { koszt_teta_id: "02620", koszt_teta_name: "ODPIS NA ZAKŁADOWY FUNDUSZ SOCJALNY" },
    { koszt_teta_id: "02630", koszt_teta_name: "POZOSTAŁE ŚWIADCZENIA NA RZECZ PRACOW." },
    { koszt_teta_id: "02710", koszt_teta_name: "APARATURA SPECJALNA" },
    { koszt_teta_id: "02720", koszt_teta_name: "PODRÓŻE SŁUŻBOWE" },
    { koszt_teta_id: "02740", koszt_teta_name: "POZOSTAŁE KOSZTY RODZAJOWE" },
    { koszt_teta_id: "03000", koszt_teta_name: "NARZUT KOSZTÓW WYDZIAŁOWYCH" },
    { koszt_teta_id: "04000", koszt_teta_name: "NARZUT KOSZTÓW OGÓLNYCH" },
    { koszt_teta_id: "11210", koszt_teta_name: "KOSZTY Z TYT. USŁUG WEWNĘTRZNYCH" },
    { koszt_teta_id: "12400", koszt_teta_name: "ZAKUPY ŚRODKÓW TRWAŁYCH I WNIP => 3500 ORAZ INWEST" },
    { koszt_teta_id: "12500", koszt_teta_name: "ZAKUPY ŚRODKÓW TRWAŁYCH i WNiP < 3500" },
]
class BISearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        }
    }
    componentDidMount() {
        if (this.props.koszt.bi && this.state.value !== this.props.koszt.bi.koszt_teta_id)
            this.setState({ value: this.props.koszt.bi.koszt_teta_id })
    }
    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => {
        this.props.onKosztChange(this.props.koszt, { koszt_teta_id: result.koszt_teta_id, bi: result });
        this.setState({ bi: result, value: result.koszt_teta_id })
    }
    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = result => re.test(result.title)

            this.setState({
                isLoading: false,
                results: _.filter(BiWszystkie, result => true),
            })
        }, 300)
    }

    render() {
        const { isLoading, value, results } = this.state
        return (
            <Search
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                results={results}
                value={value}
                resultRenderer={resultRenderer}
            />
        )
    }
}
const resultRenderer = ({ koszt_teta_id, koszt_teta_name }) => (
    <div key='content' className='content'>
        {koszt_teta_id && <div className='title'>{koszt_teta_id}</div>}
        {koszt_teta_name && <div className='description'>{koszt_teta_name}</div>}
    </div>
)

export default BISearch