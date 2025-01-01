import { Button, Container, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Iz4Context } from '../context/iz4context';
import { useNavigate } from 'react-router-dom';

const NavButtons: React.FC = (): React.ReactElement => {

    const {
        username,
        logUserOut,
        setDialogOpen
    } = useContext(Iz4Context);

    const navigate = useNavigate();

    return (
        <Container
            sx={{
                margin: 2
            }}
        >
            {/* Buttons, while not logged in: */}

            {(username === '')
                ? <>
                    <Button
                        sx={{
                            margin: 1,
                            background: "rgb(0,0,80)",
                            color: "white",
                            border: "1px solid white"
                        }}
                        onClick={() => {
                            navigate('/login');
                        }}>
                        Kirjaudu sisään
                    </Button>
                    <Button
                        sx={{
                            background: "darkgreen",
                            color: "white"
                        }}
                        onClick={() => {
                            navigate('/register');
                        }}>
                        Rekisteröidy
                    </Button>
                </>
                : <>

                {/* Buttons, while logged in */}
                    <Typography>{`Kirjautunut: ${username} `}</Typography>

                    <Button
                        sx={{
                            margin: 1,
                            background: "rgb(0,0,80)",
                            color: "white",
                            border: "1px solid white"
                        }}
                        size="small"
                        onClick={() => {
                            logUserOut()
                        }}>
                        Kirjaudu ulos
                    </Button>

                    <Button
                        sx={{
                            margin: 1,
                            background: "rgb(0,0,80)",
                            color: "white",
                            border: "1px solid white"
                        }}
                        onClick={() => { setDialogOpen(true) }}
                    >
                        Tallenna uudet tunnisteet
                    </Button>

                    <Button
                        sx={{
                            margin: 1,
                            background: "rgb(0,0,80)",
                            color: "white",
                            border: "1px solid white"
                        }}
                        onClick={() => { navigate("/settings") }}
                        color="secondary">
                        Omat asetukset
                    </Button>
                </>
            }
        </Container>
    );
}

export default NavButtons;