import { Alert, Container, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Iz4Context } from '../context/iz4context';
import NavButtons from './NavButtons';

const Header: React.FC = (): React.ReactElement => {
    const {
        message
    } = useContext(Iz4Context);

    return (
        <Container sx={{
            background: "rgb(0,0,80)",
            backgroundImage: "darkBlue",
            color: "green",
            borderRadius: 2,
            margin: 1,
            textAlign: "center",
            width: "100vw"
        }}>
            <Typography variant="h4">
                iz
                <span style={{ color: "lightGreen" }}>
                    4
                </span>
            </Typography>

            <NavButtons />

            <Container>
                { // if message, show it here:
                    (message !== '')
                        ? <Alert severity="error">{message}</Alert>
                        : <></>
                }
            </Container>
        </Container>
    );
}

export default Header;