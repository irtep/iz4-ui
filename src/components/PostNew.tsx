import React, { useRef, useState, SetStateAction, Dispatch } from 'react';
import { Stack, Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';
import { CredentialsTypes } from './sharedInterfaces/sharedInterfaces';

interface PropsTypesPostNew {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  apiCall: (method: string, credentials: CredentialsTypes) => Promise<void>
}

interface Errors {
  page: string
  userNameOnSite: string
  passwordOnSite: string
}

const PostNew: React.FC<PropsTypesPostNew> = (props): React.ReactElement => {
  const [errors, setErrors] = useState<Errors>({ page: '', userNameOnSite: '', passwordOnSite: '' });
  const formRef: any = useRef<HTMLFormElement>();

  const save = (e: React.FormEvent): void => {
    e.preventDefault();

    // minimum 2 characters each
    if (formRef.current?.page.value.length < 2) { setErrors({ ...errors, page: 'vähintään 2 merkkiä vaaditaan' }) }
    else if (formRef.current?.usernameOnSite.value.length < 2) { setErrors({ ...errors, userNameOnSite: 'vähintään 2 merkkiä vaaditaan' }) }
    else if (formRef.current?.passwordOnSite.value.length < 2) { setErrors({ ...errors, passwordOnSite: 'vähintään 2 merkkiä vaaditaan' }) }
    
    // if minimum character requirements are met, then continues:
    else {
      props.apiCall("POST", {
        page: String(formRef.current?.page.value),
        username: String(formRef.current?.usernameOnSite.value),
        password: String(formRef.current?.passwordOnSite.value),
      });
      // close this dialog
      props.setDialogOpen(false);
    }

    setTimeout(() => {
      setErrors({
        page: '',
        userNameOnSite: '',
        passwordOnSite: ''
      });
    }, 3000);
  }

  const cancelSend = (): void => {
    props.setDialogOpen(false);
  }

  return <Dialog
    maxWidth="lg"
    fullWidth={true}
    open={props.dialogOpen}
    onClose={cancelSend}
  >

    <DialogTitle>Talletettava tunniste</DialogTitle>

    <DialogContent style={{ paddingTop: 10 }}>
      <Stack
        spacing={1}
        component="form"
        onSubmit={save}
        ref={formRef}
      >

        <></>:
        <TextField
          required
          name="page"
          label="Sivu tai palvelu"
          fullWidth
          variant="outlined"
          helperText={errors.page}
        />

        <TextField
          required
          name="usernameOnSite"
          label="Talletettava käyttäjänimi"
          fullWidth
          variant="outlined"
          helperText={errors.userNameOnSite}
        />

        <TextField
          required
          name="passwordOnSite"
          label="Talletettava salasana"
          fullWidth
          variant="outlined"
          helperText={errors.passwordOnSite}
        />

        <Button
          variant="contained"
          type="submit"
        >Tallenna</Button>

        <Button
          variant="outlined"
          onClick={cancelSend}
        >Peruuta</Button>

      </Stack>
    </DialogContent>
  </Dialog>;
}

export default PostNew;