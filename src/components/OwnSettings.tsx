import React, { useState, useRef, useContext } from 'react';
import { TextField, Button, Stack, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Iz4Context } from '../context/iz4context';

interface Errors {
    oldPassword: string
    newPassword1: string
    newPassword2: string
}

const OwnSettings: React.FC = (): React.ReactElement => {
    const [errors, setErrors] = useState<Errors>({ oldPassword: '', newPassword1: '', newPassword2: '' });
    const [msg, setMsg] = useState<string>('');

    const {
        username,
        token,
        apiCall
      } = useContext(Iz4Context);

    const navigate = useNavigate();
    const formRef: any = useRef<HTMLFormElement>();

    const cancelSend = () => {
        navigate("/");
    }

    const save = (e: React.FormEvent) => {
        e.preventDefault();

        setMsg('');

        // minimum 2 characters each
        if (formRef.current?.oldPassword.value.length < 2) { setErrors({ ...errors, oldPassword: 'vähintään 2 merkkiä vaaditaan' }) }
        else if (formRef.current?.newPassword1.value.length < 2) { setErrors({ ...errors, newPassword1: 'vähintään 2 merkkiä vaaditaan' }) }
        else if (formRef.current?.newPassword2.value.length < 2) { setErrors({ ...errors, newPassword2: 'vähintään 2 merkkiä vaaditaan' }) }
        
        // if minimum character requirements are met, then continues:
        else {
    
            // check that new and old password all same
            if (formRef.current?.newPassword1.value === formRef.current?.newPassword2.value) {
                const payload = {
                    token: token,
                    oldPassword: formRef.current?.oldPassword.value,
                    newPassword: formRef.current?.newPassword2.value
                };

                apiCall('PUT', payload, undefined, undefined, true);
                navigate("/");

            } else {
                setMsg('uudet salasanat eivät täsmää.');
            }
    
        }
    
        // remove possible errors after few seconds
        setTimeout(() => {
          setErrors({
            oldPassword: '',
            newPassword1: '',
            newPassword2: ''
          });
        }, 3000);
    }

    if (username) {
        return (
            <Container>

                <Typography>
                    Moi {username}! Jos haluat vaihtaa salasanaa, niin kirjoita alla oleviin kenttiin pyydetyt tiedot
                </Typography>

                <Stack
                    spacing={1}
                    component="form"
                    onSubmit={save}
                    ref={formRef}
                >

                    <></>:
                    <TextField
                        required
                        name="oldPassword"
                        label="Nykyinen salasanasi"
                        fullWidth
                        variant="outlined"
                        helperText={errors.oldPassword}
                    />

                    <TextField
                        required
                        name="newPassword1"
                        label="Uusi salasana"
                        fullWidth
                        variant="outlined"
                        helperText={errors.newPassword1}
                    />

                    <TextField
                        required
                        name="newPassword2"
                        label="Toista uusi salasana"
                        fullWidth
                        variant="outlined"
                        helperText={errors.newPassword2}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                    >Vaihda</Button>

                    <Button
                        variant="outlined"
                        onClick={cancelSend}
                    >Peruuta</Button>

                </Stack>

                <Typography>
                    {msg}
                </Typography>

            </Container>
        );
    } else {
        return (
            <>
                <Button
                    variant="outlined"
                    onClick={cancelSend}
                >Palaa pääsivulle</Button>
            </>
        );
    }
}

export default OwnSettings;