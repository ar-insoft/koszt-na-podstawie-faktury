import React from 'react'

export const SearchContext = React.createContext({
    id: 'xasd',
    setSearcher: () => { },
})

export class SearchContextImplementation {
    fromContext = () => {
        return this.info
    }
}