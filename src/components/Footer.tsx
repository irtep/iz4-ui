import { Container, Typography } from '@mui/material';
import React from 'react';

const Footer: React.FC = (): React.ReactElement => {

    return (
        <Container sx={{
            position: 'fixed',
            bottom: 0,
            color: "rgb(0,0,80)",
            borderRadius: 2,
            margin: 1,
            padding: 1
        }}>
            <Typography>
                Version: 0.3.0
            </Typography>
        </Container>
    );
}

export default Footer;