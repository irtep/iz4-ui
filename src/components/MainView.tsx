import React, { useState, useContext } from 'react';
import { Alert, Backdrop, CircularProgress, IconButton, Container, ListItem, ListItemText, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import PostNew from './PostNew';
import CardActions from './CardActions';
import { CredentialsTypes, SelectedProps } from '../sharedInterfaces/sharedInterfaces';
import { Iz4Context } from '../context/iz4context';

const MainView: React.FC = (): React.ReactElement => {
  const [selectedCard, setSelectedCard] = useState<SelectedProps>({
    id: '',
    action: ''
  })

  const {
    apiData,
    setDialogOpen,
    dialogOpen,
    apiCall,
    isMobile
  } = useContext(Iz4Context);

  return (
    <Container>

      {/* Show all credentials here */}

      {(Boolean(apiData.error))
        ? <Alert severity="error">{apiData.error}</Alert>
        : (apiData.fetchReady)
          ? <Grid
            container
            spacing={1}>

            { /* Left side of the grid */}

            <Grid item lg={6}>
              {apiData.allCredentials.map((cred: CredentialsTypes, idx: number) => {
                return <ListItem
                  key={idx}
                >
                  <IconButton
                    sx={{ marginRight: 2, color: "green" }}
                    onClick={() => {
                      setSelectedCard({
                        id: cred.id,
                        action: 'show'
                      });
                      (isMobile)
                        ? window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                        : window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton
                    sx={{ marginRight: 2, color: "purple" }}
                    edge="end"
                    onClick={() => {
                      setSelectedCard({
                        id: cred.id,
                        action: 'edit'
                      });
                      console.log('edit click');
                      (isMobile)
                        ? window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                        : window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    sx={{ marginRight: 2, color: "red" }}
                    edge="end"
                    onClick={() => {
                      setSelectedCard({
                        id: cred.id,
                        action: 'delete'
                      });
                      (isMobile)
                        ? window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                        : window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>

                  <ListItemText
                    primary={cred.page}
                  />
                </ListItem>
              })}

            </Grid>

            {/* Right side of the grid */}

            <Grid item lg={6}>
              <CardActions
                apiData={apiData}
                selectedCard={selectedCard}
                apiCall={apiCall}
              />
            </Grid>

          </Grid> :
          <Backdrop open={true}>
            <CircularProgress color='inherit' />
          </Backdrop>
      }

      {/* Add new credentials */}
      <PostNew
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        apiCall={apiCall}
      />

    </Container>
  );
}

export default MainView;
