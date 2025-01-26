import React, { useContext, useRef, useState } from "react";
import { Backdrop, Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { Iz4Context } from "../context/iz4context";

interface DetailsOfUser {
    token: string,
    username: string,
    admin: boolean,
    testAccount: boolean
}

const Login: React.FC = () : React.ReactElement => {
    const [msg, setMsg] = useState<string>('');

    const {
        setToken,
        setUsername,
        setAdmin,
        setTestAccount,
        modeOfUse
      } = useContext(Iz4Context);

    const navigate : NavigateFunction = useNavigate();

    const lomakeRef = useRef<HTMLFormElement>();

    const logIn = async (e : React.FormEvent) : Promise<void> => {
        
        e.preventDefault();

        if (lomakeRef.current?.username.value) {
            
            if (lomakeRef.current?.password.value) {
                const url: string = (modeOfUse === "dev") ?
                    "http://localhost:5509/api/auth/login" :
                    "/api/auth/login";
                const connection = await fetch(url, {
                    method : "POST",
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({
                        username : lomakeRef.current?.username.value,
                        password : lomakeRef.current?.password.value
                    })
                });

                if (connection.status === 200) {

                    //let {token} = await connection.json();
                    let response = await connection.json();
                    console.log('resp: ', response);

                    setToken(response.token);
                    setUsername(lomakeRef.current?.username.value);
                    setAdmin(response.admin);
                    setTestAccount(response.testAccount);

                    const userDetails: DetailsOfUser = {
                        token: response.token,
                        username: lomakeRef.current?.username.value,
                        admin: response.admin,
                        testAccount: response.testAccount
                    }

                    localStorage.setItem("uDetails", JSON.stringify(userDetails));
                    navigate("/");

                } else if (connection.status === 401) {
                    setMsg('Käyttäjänimi tai salasana väärin');
                    setTimeout( () => { setMsg('')}, 10000);
                } else {
                    setMsg(`Tarkista, onko palvelin päällä. Virhekoodi: ${connection.status}`);
                    setTimeout( () => { setMsg('')}, 10000);                    
                }
            } 
        } 
    };

    return (
            <Backdrop open={true}>
                <Paper sx={{padding : 2}}>
                    <Box
                        component="form"
                        onSubmit={logIn}
                        ref={lomakeRef}
                        style={{
                            width: 300,
                            backgroundColor : "#fff",
                            padding : 20
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="h6">Kirjaudu sisään</Typography>
                            <TextField 
                                label="Käyttäjätunnus" 
                                name="username"
                            />
                            <TextField 
                                label="Salasana"
                                name="password"
                                type="password" 
                            />
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                            >
                                Kirjaudu
                            </Button>

                        </Stack>

                          <Button onClick= { () => { navigate("/"); }}>Palaa takaisin</Button>
                        
                        <Typography sx={{marginTop: 10}}>{msg}</Typography>

                    </Box>
                </Paper>
            </Backdrop>
    );
};

export default Login;
