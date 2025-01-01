import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { ApiData, CredentialsTypes } from '../sharedInterfaces/sharedInterfaces';

interface PropsType {
    idOfSelectedCard?: number | string
    apiCall: (method: string, credentials?: CredentialsTypes, token?: undefined, id?: string | number) => Promise<void>
    apiData: ApiData
}

const DeleteCard: React.FC<PropsType> = (props): React.ReactElement => {

    const selectedCredentials = props.apiData.allCredentials.filter((cred: CredentialsTypes) => cred.id === props.idOfSelectedCard)

    const deleteCredentials = () => {
        props.apiCall('DELETE', undefined, undefined, props.idOfSelectedCard);
    }

    if (selectedCredentials[0]) {
        return (
            <Container sx={{ 
                marginTop: 5,
                padding: 5,
                background: "red",
                maxWidth: 350
                }}>

                <Typography>
                    Haluatko varmasti tuhota tunnuksen, palveluun:
                    <strong>
                        {selectedCredentials[0].page}
                    </strong>
                </Typography>

                <Button
                    variant="contained"
                    sx={{ margin: 5 }}
                    onClick={deleteCredentials}
                >Kyllä haluan</Button>

            </Container>
        );
    } else {
        return (<></>);
    }


}

export default DeleteCard;