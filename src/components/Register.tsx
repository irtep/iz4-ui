    import React, { useContext, useRef, useState } from "react";
    import { Backdrop, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
    import { useNavigate, NavigateFunction } from 'react-router-dom';
    import { Iz4Context } from "../context/iz4context";

    const Register: React.FC = (): React.ReactElement => {
        const [msg, setMsg] = useState<string>('');
        const navigate: NavigateFunction = useNavigate();
        const formRef = useRef<HTMLFormElement>();

        const {
            modeOfUse
        } = useContext(Iz4Context);

        const registerUser = async (e: React.FormEvent): Promise<void> => {
            e.preventDefault();

            if (formRef.current?.username.value) {
                if (formRef.current?.password.value) {
                    if (formRef.current?.password.value === formRef.current?.password2.value) {
                        const url: string = (modeOfUse === "dev") ?
                        "http://localhost:5509/api/users" :
                        "/api/users";
                        const connection: Response = await fetch(url, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                username: formRef.current?.username.value,
                                password: formRef.current?.password.value,
                                auth: formRef.current?.auth.value
                            })
                        });

                        if (connection.status === 200) {
                            setMsg('Käyttäjätunnus on nyt rekisteröity, voit nyt kirjautua sisään');
                            setTimeout(() => {
                                setMsg('')
                                navigate("/login");
                            }, 5000);


                        } else if (connection.status === 400) {
                            setMsg('Käyttäjänimi on jo rekisteröity');
                            setTimeout(() => { setMsg('') }, 10000);
                        }

                        else if (connection.status === 403) {
                            setMsg('Ei lupaa, pyydä lupa adminilta');
                            setTimeout(() => { setMsg('') }, 10000);
                        }

                    } else {
                        setMsg('Salasanat eivät täsmää');
                        setTimeout(() => { setMsg('') }, 10000);
                    }
                }
            }
        };

        return (
            <Backdrop open={true}>
                <Paper sx={{ padding: 2 }}>
                    <Box
                        component="form"
                        onSubmit={registerUser}
                        ref={formRef}
                        style={{
                            width: 300,
                            backgroundColor: "#fff",
                            padding: 20
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="h6">Rekisteröi uusi käyttäjätunnus</Typography>
                            <TextField
                                label="Käyttäjätunnus"
                                name="username"
                            />
                            <TextField
                                label="Salasana"
                                name="password"
                                type="password"
                            />
                            <TextField
                                label="Salasana uudelleen"
                                name="password2"
                                type="password"
                            />
                            <TextField
                                label="Lupa koodi"
                                name="auth"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                            >
                                Rekisteröidy
                            </Button>

                        </Stack>

                        <Button onClick={() => { navigate("/"); }}>Palaa takaisin</Button>

                        <Typography sx={{ marginTop: 10 }}>{msg}</Typography>

                    </Box>
                </Paper>
            </Backdrop>
        );
    };

    export default Register;
