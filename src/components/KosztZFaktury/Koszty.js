class Koszty {
    constructor(initList) {
        this.listaKosztow = initList
    }

    wartoscKwalfikowanaSuma = () => {
        console.log('Koszty.wartoscKwalfikowanaSuma', this.listaKosztow)
        return this.roundUp(this.listaKosztow.reduce((a, b) => a.wartosc_kwalfikowana + b.wartosc_kwalfikowana),2) //.toPrecision(6)
    }

    roundUp = (num, precision) => {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
    }

    aktualizujPoleKosztu = (koszt, changes) => {
        console.log('Koszty.aktualizujPoleKosztu', this, changes)
        var kosztWLiscie = this.listaKosztow.find(el => el.id === koszt.id)
        Object.assign(kosztWLiscie, changes);
        return this
    }

    dodajNowyKoszt = () => {

    }

    zapiszKoszt = (koszt) => {
        var kosztWLiscie = this.listaKosztow.find(el => el.id === koszt.id)
        console.log('Koszty.zapiszKoszt', kosztWLiscie)
        const kosztJson = JSON.stringify({ ...kosztWLiscie })

        fetch('/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=save_koszt', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded' //'Content-Type': 'application/json' 
            },
            body: 'koszt=' + kosztJson //JSON.stringify({ ...kosztWLiscie })
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                const kosztZapisany = response.json();
                Object.assign(kosztWLiscie, kosztZapisany);
                return kosztZapisany
            })
    }

//     function registerNewAccount(user, setNewUser, setError) {
//     let responseError = false;
//     fetch('/authentication_provider_impl/register_new_account', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...user })
//     })
//         .then(response => {
//             if (!response.ok) {
//                 responseError = true;
//                 return response.json();
//             }
//             return response.json();
//         })
//         .then(json => {
//             if (responseError) {
//                 setError(json.error);
//             } else {
//                 setNewUser(json);
//             }
//             console.log('userService.registerNewAccount.json ', responseError, json);
//         })
//         .catch(error => {
//             console.log('userService.registerNewAccount.catch ', error);
//         }
//         );
// } 
}

export {Koszty}