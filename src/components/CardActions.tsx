import React from 'react';
import { Container } from '@mui/material';
import { CredentialsTypes, ApiData, SelectedProps } from '../sharedInterfaces/sharedInterfaces';
import ShowCard from './ShowCard';
import EditCard from './EditCard';
import DeleteCard from './DeleteCard';

interface PropsCardActions {
    apiData: ApiData
    selectedCard: SelectedProps
    apiCall: (method: string, credentials?: CredentialsTypes, token?: undefined, id?: string | number) => Promise<void>
}

const CardActions: React.FC<PropsCardActions> = (props): React.ReactElement => {

    if (props.selectedCard.id === '') {
        return (
            <>
            </>
        );
    } else {

        if (props.selectedCard.action === 'delete') {

            return (
                <Container>

                    <DeleteCard
                        apiCall={props.apiCall}
                        apiData={props.apiData}
                        idOfSelectedCard={props.selectedCard.id}
                    />

                </Container>
            );
        }

        if (props.selectedCard.action === 'edit') {

            return (
                <Container sx={{ marginTop: 5 }}>

                    <EditCard
                        id={props.selectedCard.id}
                        credentials={props.apiData.allCredentials.filter((cred: CredentialsTypes) => cred.id === props.selectedCard.id)}
                        apiCall={props.apiCall}
                    />


                </Container>
            );
        }

        if (props.selectedCard.action === 'show') {
            return (
                <Container sx={{ marginTop: 5 }}>
                    <ShowCard
                        id={props.selectedCard.id}
                        credentials={props.apiData.allCredentials.filter((cred: CredentialsTypes) => cred.id === props.selectedCard.id)}
                    />

                </Container>
            );
        }

        else { return (<></>); }
    }

}

export default CardActions;