//import { Observable, Subject, ReplaySubject, range } from 'rxjs'
import { from, of, interval, concat } from 'rxjs'
import axios from 'axios'
import { Koszty } from './Koszty'
import { Faktura } from './Faktura'

class DataProviderAxios {
    constructor() {
        //this.projectListObservable = Observable.fromPromise(DataProvider.projectList())
        //this.projectListObservable = from(DataProvider.projectListPromise())
        //console.log('DataProvider.constructor', interval)

        DataProviderAxios.processRequest(DataProviderAxios.projectListPromise(), projectList => { this.projectListObservable = from(projectList) })
        
        var numbers = of(10, 20, 30);
        var letters = of('a', 'b', 'c');
        var interv = interval(1000);
        var result = concat(numbers, letters,interv);
        //result.subscribe(x => console.log(x));
    }

/**
 * Pobieranie danych faktury i jej kosztów z backend
 * @param {number} idFaktury Id faktury
 * @param {function} dataHandler function (faktura:Faktura, koszty:Koszty) {// handle success }
 * @param {function} errorHandler function (error) {// handle error }
 * @param {function} finallyHandler function () {// always executed }
 */
    static pobierzDaneFaktury = (idFaktury, dataHandler, errorHandler, finallyHandler) => {
        axios.all([Faktura.readAxios(idFaktury), Koszty.pobierzListeKosztowAxios(idFaktury)])
            .then(axios.spread((fakturyResponse, kosztyResponse) => {
                dataHandler(fakturyResponse.data, kosztyResponse.data)
            }))
            .catch(function (error) {
                // handle error
                errorHandler(error);
            })
            .then(() => {
                // always executed
                finallyHandler()
            })
    }

    /**
     * Zapisywanie faktury
     * @param {object} faktura faktura do zapisu
     * @param {function} dataHandler function (faktura:Faktura) {// handle success }
     * @param {function} errorHandler function (error) {// handle error }
     * @param {function} finallyHandler function () {// always executed }
     */
    static zapiszFakture = (faktura, dataHandler, errorHandler, finallyHandler) => {
        const fakturaDoZapisu = faktura.fakturaDoZapisu()
        const fakturaJson = JSON.stringify(fakturaDoZapisu)

        // axios({
        //     method: 'post',
        //     url: '/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=save_faktura',
        //      headers: {
        //          'Content-Type': 'application/x-www-form-urlencoded',
        //          responseEncoding: 'utf8'
        //     },
        //     data: //fakturaJson
        //     {
        //         //'faktura': fakturaJson,
        //         test: 'tewsowe'
        //     }
        // })
        axios.post('/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=save_faktura',
            //JSON.stringify({ faktura: fakturaDoZapisu })
            { faktura: fakturaDoZapisu }
            , {
            headers: {
                //'Content-Type': 'application/x-www-form-urlencoded',
                responseEncoding: 'utf8'
            }
        })
            .then(({ data }) => {
                console.log('DataProvider.zapiszFakture ' + (data.is_request_successful === false),data)
                if (data.is_request_successful === false)
                    return Promise.reject(data.error_message)
                dataHandler(data)
            })
            .catch((error) => {
                // handle error
                errorHandler(error);
            })
            .then(() => {
                // always executed
                finallyHandler()
            })
        // fetch('/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=save_faktura', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded' //'Content-Type': 'application/json' 
        //         , responseEncoding: 'utf8'
        //     },
        //     body: 'faktura=' + fakturaJson
        // })
     }

    static projectListPromise = () => {
        const url = '/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=koszty_pwr_szukanie_projektu'
        return fetch(url, {
            method: 'get',
            headers: { 'Content-Type': 'application/json', },
        })
    }

    static processRequest = (myPromise, resolve) => {
        myPromise
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json();
            })
            .then(json => {
                resolve(json)
            })
    }

    static processObservable = (observable, resolve) => {
        Promise.resolve(observable)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json();
            })
            .then(json => {
                resolve(json)
            })
    }
}

export default DataProviderAxios