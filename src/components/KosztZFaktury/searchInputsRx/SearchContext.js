import React from 'react'
import { Subject, from, of, Observable } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'

export const SearchContext = React.createContext({
    id: 'xasd',
    setSearcher: () => { },
})

const observ = {
    
}
export class SearchContextImplementation {
    constructor() {
        this.searchTerm = new Subject();

        const evenNumbers = Observable.create(function (observer) {
            let value = 0;
            const interval = setInterval(() => {
                if (value % 2 === 0) {
                    observer.next(value);
                }
                value++;
            }, 1000);

            return () => clearInterval(interval);
        });
    }

    search = (term) => {
        this.searchTerm.next(term.value);
    }

    doSearch = (projectId) => {
        const url = '/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=koszty_pwr_szukanie_zadania&projectId=' + projectId
        let promise = fetch(url).then(response => response.json());
        return from(promise)
    }

    getResults = () => {
        console.log('SearchContextImplementation.getResults', this.searchTerm)
        return this.searchTerm
            //.debounceTime(500)
            .pipe(debounceTime(500))
            .distinctUntilChanged()
            .switchMap(term => term
                ? this.doSearch(term)
                : of([]))
            .catch(error => {
                console.error(error);
                return of([]);
            });
    }

    fromContext = () => {
        return this.info
    }
}