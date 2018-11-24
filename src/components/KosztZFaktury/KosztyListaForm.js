import React from 'react'
import { Table, Button, Icon } from 'semantic-ui-react'

const KosztyListaForm = (props) => {
    const handleDeleteKoszt = (koszt) => { 
        props.onKosztDelete(koszt)
    }

    return (
        <Table celled striped>
            <Table.Header>
                <Table.Row textAlign="center">
                    <Table.HeaderCell width={3}>
                        Koszt
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Projekt
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Zadanie
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        BI
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Wartość
                    </Table.HeaderCell>
                    <Table.HeaderCell>

                    </Table.HeaderCell>
            </Table.Row>
        </Table.Header>
            <Table.Body>
                {Array.from(props.koszty.listaKosztow).reverse().map(koszt => {
                    return (
                        <Table.Row key={koszt.id}>
                            <Table.Cell>
                                Koszt {koszt.last_change_timestamp || 'niezapisany'}
                            </Table.Cell>
                            <Table.Cell>
                                {koszt.projekt && koszt.projekt.object_index}
                            </Table.Cell>
                            <Table.Cell>
                                {koszt.zadanie && koszt.zadanie.nazwa}
                            </Table.Cell>
                            <Table.Cell>
                                {koszt.bi && koszt.bi.numer}
                            </Table.Cell>
                            <Table.Cell width={3} textAlign="right">
                                {koszt.kwota_obciazajaca_budzet}
                            </Table.Cell>
                            <Table.Cell width={1} textAlign="center">
                                <Button icon onClick={(evt) => handleDeleteKoszt(koszt)} type='button'>
                                    <Icon name='delete' />
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table>
    )
}
        
export default KosztyListaForm