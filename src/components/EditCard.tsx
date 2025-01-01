import React, { useState, useRef } from 'react';
import { Button, TextField, Stack, Typography } from '@mui/material';
import { CredentialsTypes } from './sharedInterfaces/sharedInterfaces';

interface PropsType {
    credentials: Array<CredentialsTypes>
    id?: string | number
    apiCall: (method: string, credentials: CredentialsTypes, token: undefined, id: string | number | undefined) => Promise<void>
}

const EditCard: React.FC<PropsType> = (props): React.ReactElement => {
    const [msg, setMgs] = useState<string>('');

    const formRef: any = useRef<HTMLFormElement>();

    const creds: CredentialsTypes = props.credentials[0];

    const save = (e: React.FormEvent): void => {
        e.preventDefault();

        // variables to help to determine, what to send
        //                                  page,  username, password
        const validFields: Array<boolean> = [false, false, false];

        // atleast one fields should be filled:
        if (formRef.current?.page.value.length > 1) { validFields[0] = true; }
        if (formRef.current?.usernameOnSite.value.length > 1) { validFields[1] = true; }
        if (formRef.current?.passwordOnSite.value.length > 1) { validFields[2] = true; }

        // if all are empty, or too short value, then do nothing
        const check = validFields.filter((fieldi: boolean) => fieldi === true);

        if (check.length === 0) {

            setMgs('Muuta ainakin yhtä arvoa. Uusi arvo pitää olla vähintään kahden merkin pituinen');

        } else {
            props.apiCall("PUT", {
                page: validFields[0] ? String(formRef.current?.page.value) : creds.page,
                username: validFields[1] ? String(formRef.current?.usernameOnSite.value) : creds.username,
                password: validFields[2] ? String(formRef.current?.passwordOnSite.value) : creds.password,
            }, undefined, props.id);
        }
    }

    if (creds) {
        return (
            <Stack
                spacing={1}
                component="form"
                onSubmit={save}
                ref={formRef}
            >

                <Typography>
                    Tässä tämän hetkiset. Jos haluat vaihtaa jotain tietoa, niin muokkaa kenttää ja lähetä
                </Typography>

                <TextField
                    name="page"
                    label="Sivu tai palvelu"
                    fullWidth
                    variant="outlined"
                    placeholder={creds.page}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    name="usernameOnSite"
                    label="Talletettava käyttäjänimi"
                    fullWidth
                    variant="outlined"
                    placeholder={creds.username}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    name="passwordOnSite"
                    label="Talletettava salasana"
                    fullWidth
                    variant="outlined"
                    placeholder={creds.password}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <Button
                    variant="contained"
                    type="submit"
                >Tallenna</Button>

                <Typography sx={{ color: "red" }}>
                    {msg}
                </Typography>

            </Stack>
        );
    } else {
        return (<></>);
    }


}

export default EditCard;
