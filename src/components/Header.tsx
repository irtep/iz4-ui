import { Container, Typography } from '@mui/material';
import React from 'react';

const Header: React.FC = (): React.ReactElement => {

    return (
        <Container sx={{
            background: "rgb(0,0,80)",
            backgroundImage: "linear-gradient(to right, rgb(0,0,80) , rgb(0,0,80), rgb(0,0,80), green, cyan, white)",
            color: "green",
            borderRadius: 2,
            margin: 1,
            textAlign: "center",
            width: "100vw"
        }}> 
            <Typography variant="h4">
                iz4
            </Typography>
        </Container>
    );
}

export default Header;