import React, { Component } from 'react'
import { Table, Button, Icon } from 'semantic-ui-react'

const KosztyListaForm = (props) => (
    <Table celled striped>
        {/* <Table.Header>
            <Table.Row>
            </Table.Row>
        </Table.Header> */}
        <Table.Body>
            {Array.from(props.koszty.listaKosztow).reverse().map(koszt => {
                return (
                    <Table.Row key={koszt.id}>
                        <Table.Cell width={3}>
                            Koszt {koszt.last_change_timestamp || 'niezapisany'}
                        </Table.Cell>
                        <Table.Cell>
                            {koszt.projekt && koszt.projekt.object_index}
                        </Table.Cell>
                        <Table.Cell>
                            {koszt.zadanie && koszt.zadanie.numer}
                        </Table.Cell>
                        <Table.Cell>
                            {koszt.bi && koszt.bi.numer}
                        </Table.Cell>
                        <Table.Cell width={3} textAlign="right">
                            {koszt.kwota_obciazajaca_budzet}
                        </Table.Cell>
                        <Table.Cell width={1} textAlign="center">
                            <Button icon>
                                <Icon name='delete' />
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                )
            })}
        </Table.Body>
    </Table>
)
        
export default KosztyListaForm