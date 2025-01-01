import React, { createContext, useEffect, useState } from 'react';
import { ApiData, CredentialsTypes, FetchSettings, UserPswChangeData } from '../components/sharedInterfaces/sharedInterfaces';

export const Iz4Context: React.Context<any> = createContext(undefined);

interface Props {
  children: React.ReactNode;
}

export const Iz4Provider: React.FC<Props> = (props: Props): React.ReactElement => {
  const [token, setToken] = useState<string>(String(''));
  const [username, setUsername] = useState<string>(String(''));
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [apiData, setApiData] = useState<ApiData>({
    allCredentials: [],
    error: "",
    fetchReady: true
  });
  // Change this to match 'prod' or 'dev' depending, what you need
  const modeOfUse: String = 'dev';

  const apiCall = async (
    method?: string,
    credentials?: CredentialsTypes | UserPswChangeData,
    importToken?: string,
    id?: string,
    isUsersPasswordChange?: boolean): Promise<void> => {

    setApiData({
      ...apiData,
      fetchReady: false,
      error: ""
    });

    let prodUrl: string = `/api/credentials`;
    let devUrl: string = `http://localhost:5509/api/credentials`;
    let authToken: string = token;

    // if it is PUT or DELETE, url needs the id:
    if (method === "PUT" || method === "DELETE") {
      prodUrl = `/api/credentials/${id}`;
      devUrl = `http://localhost:5509/api/credentials/${id}`;
    }

    if (isUsersPasswordChange) {
      prodUrl = '/api/users';
      devUrl = 'http://localhost:5509/api/users';
    }

    // in some cases token statevariable is empty, so then user needs to send it by importToken
    if (importToken) { authToken = importToken }

    let settings: FetchSettings = {
      method: method || "GET",
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    };

    if (method === "POST" || method === "PUT") {
      settings = {
        ...settings,
        headers: {
          ...settings.headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      }
    }

    try {
      let chosenUrl = (modeOfUse === 'dev') ? devUrl : prodUrl;
      const connection: Response = await fetch(chosenUrl, settings);

      if (connection.status === 200) {
        if (isUsersPasswordChange) {

          setMessage('Salasanasi on vaihdettu!');
          setApiData({
            ...apiData,
            fetchReady: true
          });

          setTimeout(() => {
            setMessage('')
          }, 3000);

        } else {

          setApiData({
            ...apiData,
            allCredentials: await connection.json(),
            fetchReady: true
          });

          // if it was POST or PUT, confirm, that credentials are now saved
          if (method === 'POST' || method === 'PUT') {

            setMessage('Tunnukset tallennettu!');
            setTimeout(() => {
              setMessage('')
            }, 3000);
          }
        }
      } else {

        let errorText: string = "";

        switch (connection.status) {
          case 401: errorText = "Ei lupaa tietoihin / toimenpiteeseen."; break;
          case 400: errorText = "Virhe pyynnön tiedoissa"; break;
          default: errorText = "Palvelimella tapahtui odottamaton virhe"; break;
        }

        setApiData({
          ...apiData,
          error: errorText,
          fetchReady: true
        });
        setTimeout(() => {
          setApiData({
            ...apiData,
            error: ''
          });
        }, 3000);
      }

    } catch (e: any) {
      setApiData({
        ...apiData,
        error: "Palvelimeen ei saada yhteyttä",
        fetchReady: true
      });
    }
  }

  useEffect(() => {

    // logs in, if user did not logged out
    const loggedUserJSON = window.localStorage.getItem('uDetails');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setToken(user.token);
      setUsername(user.username);
      // fetches users saved credentials
      apiCall(undefined, undefined, user.token);
    }
  }, []);

  useEffect(() => {

    if (username) {
      apiCall();
    }
  }, [username]);

  return (
    <Iz4Context.Provider value={{
      token, setToken,
      username, setUsername,
      dialogOpen, setDialogOpen,
      message, setMessage,
      apiData, setApiData,
      apiCall,
      modeOfUse
    }}>
      {props.children}
    </Iz4Context.Provider>
  );
}
