import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, Typography, Avatar } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CredentialsTypes } from './sharedInterfaces/sharedInterfaces';

interface PropsType {
    credentials: Array<CredentialsTypes>
    id: string | number | undefined
}

const ShowCard: React.FC<PropsType> = (props): React.ReactElement => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [msg, setMgs] = useState<string>('');

    const creds: CredentialsTypes = props.credentials[0];

    async function copyToClipboard(target: string, what: string) {

        setMgs('');

        try {
            await navigator.clipboard.writeText(target);
            setMgs(`${what} kopioitu leikepöydälle`);
            setTimeout(() => {
                setMgs('')
            }, 1000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    useEffect(() => {
        // always when changed, copied password to clipboard
        if (msg === '' && creds) {
            copyToClipboard(creds.password, 'salasana');
        }
    }, [props]);

    if (creds) {
        return (
            <Card sx={{ minHeight: 340, minWidth: 300, marginLeft: 10 }}>
                <CardHeader
                    sx={{ minHeight: 130 }}
                    title={`Palvelu: ${creds.page}`}
                    avatar={
                        <Avatar sx={{ bgcolor: "green" }} aria-label="recipe">
                            <KeyIcon />
                        </Avatar>
                    }
                />

                <CardContent>
                    <Typography>
                        Käyttäjänimi: {creds.username} <ContentCopyIcon
                            sx={{
                                color: "blue",
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                copyToClipboard(creds.username, 'käyttäjänimi');
                            }} />
                    </Typography>
                    <Typography>
                        {
                            (showPassword) ?
                                <>
                                    Salasana: {creds.password} <VisibilityOffIcon
                                        sx={{
                                            color: "blue",
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            setShowPassword(false);
                                        }}
                                    />
                                    <ContentCopyIcon
                                        sx={{
                                            color: "blue",
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            copyToClipboard(creds.password, 'salasana');
                                        }} />
                                </> :
                                <>
                                    Salasana: <VisibilityIcon
                                        sx={{
                                            color: "blue",
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            setShowPassword(true);
                                        }}
                                    />
                                    <ContentCopyIcon
                                        sx={{
                                            color: "blue",
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            copyToClipboard(creds.password, 'salasana');
                                        }} />
                                </>
                        }
                    </Typography>

                    <Typography sx={{ color: 'green' }}>
                        {msg}
                    </Typography>

                </CardContent>

            </Card>
        );
    } else {
        return (<></>);
    }
}

export default ShowCard;
