class Koszt {
    constructor(initialFields) {
        //console.log('Koszt.constructor', initialFields)
        this.id = -1
        this.forma_platnosci = '1'
        this.opis = ''
        this.rok_budzetowy = (new Date()).getFullYear()
        const wartosc = isNaN(initialFields.domyslnaWartosc) ? 0 : parseFloat(initialFields.domyslnaWartosc)
        this.kwota_obciazajaca_budzet = wartosc > 0 ? wartosc.toFixed(2) : 0.00
        //this.faktura_id = fakturaId
        this.grupa_id = 1
        Object.assign(this, initialFields)
    }

    onFieldChange = (key, value) => {
        console.log('Koszt.onFieldChange(' + key + ', ' + value + ')', key === 'real_value' || key === 'vat_value')
        if (key === 'real_value' || key === 'vat_value') {
            const real_value = isNaN(this.real_value) ? 0 : parseFloat(this.real_value)
            const vat_value = isNaN(this.vat_value) ? 0 : parseFloat(this.vat_value)
            this.kwota_obciazajaca_budzet = real_value + vat_value
            //this[key] = value.toFixed(2)
        }
        if (key === 'kwota_obciazajaca_budzet') {
            this.real_value = ''
            this.vat_value = ''
        }
    }

    usunWyborProjektu = () => {
        console.log('Koszt.usunWyborProjektu')
        this.id_zlecenie = ''
        this.projekt = null
        this.usunWyborZadania()
        return this
    }
    usunWyborZadania = () => {
        this.koszt_teta_parent_id = ''
        this.zadanie = null
        this.usunWyborBi()
        return this
    }
    usunWyborBi = () => {
        this.koszt_teta_id = ''
        this.bi = null
        return this
    }

    isSaved = () => this.id > 0
        
    delete = (promiseHandler) => {
        fetch('/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=delete_koszt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' //'Content-Type': 'application/json' 
            },
            body: 'kosztId=' + this.id
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json()
            })
            .then(json => {
                //const kosztZapisany = json
                promiseHandler(this)
            })

    }

}

export default Koszt