import React, { createContext, useEffect, useState } from 'react';
import { ApiData, CredentialsTypes, FetchSettings, UserPswChangeData } from '../sharedInterfaces/sharedInterfaces';
import useIsMobile from '../customHooks/useIsMobile';

export const Iz4Context: React.Context<any> = createContext(undefined);

interface Props {
  children: React.ReactNode;
}

export const Iz4Provider: React.FC<Props> = (props: Props): React.ReactElement => {
  const [token, setToken] = useState<string>(String(''));
  const [username, setUsername] = useState<string>(String(''));
  const [admin, setAdmin] = useState<boolean>(false);
  const [testAccount, setTestAccount] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [apiData, setApiData] = useState<ApiData>({
    allCredentials: [],
    error: "",
    fetchReady: true
  });
  const isMobile: boolean = useIsMobile();
  // Change this to match 'prod' or 'dev' depending, what you need
  const modeOfUse: String = 'prod';

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

      const isCredentialsTypes = (obj: any): obj is CredentialsTypes => {
        return typeof obj.username === "string" && typeof obj.password === "string";
      }

      // if test account, do not add to database
      // test with POST
      if (testAccount &&
        (method === "POST") &&
        isCredentialsTypes(credentials)
      ) {
        setApiData({
          ...apiData,
          allCredentials: [
            ...apiData.allCredentials,
            credentials
          ],
          fetchReady: true
        });
        setMessage('Tunnukset tallennettu (väliaikasesti, koska käytät testitunnuksia)!');
        setTimeout(() => {
          setMessage('')
        }, 3000);
      }
      // test with DELETE
      else if (testAccount && method === "DELETE") {
        setApiData({
          ...apiData,
          allCredentials: [
            ...apiData.allCredentials.filter(credential => credential.id !== id)
          ],
          fetchReady: true
        });
        setMessage('Tunnukset poistettu (väliaikasesti, koska käytät testitunnuksia)!');
        setTimeout(() => {
          setMessage('')
        }, 3000);
      }
      // test with PUT
      else if (testAccount &&
        (method === "PUT") &&
        isCredentialsTypes(credentials)
      ) {
        setApiData({
          ...apiData,
          allCredentials: [
            ...apiData.allCredentials.map((oldCreds) => {
              if (oldCreds.id === id) {
                return credentials;
              } else {
                return oldCreds;
              }
            })
          ],
          fetchReady: true
        });
        setMessage('Muutokset tallennettu (väliaikasesti, koska käytät testitunnuksia)!');
        setTimeout(() => {
          setMessage('')
        }, 3000);
      }
      // non test account
      else {
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
            case 401:
              errorText = "Ei lupaa tietoihin / toimenpiteeseen.";
              if (!isUsersPasswordChange) {
                // if this is not password change fail, log user out
                logUserOut();
              }
              break;
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
      }
    } catch (e: any) {
      setApiData({
        ...apiData,
        error: "Palvelimeen ei saada yhteyttä",
        fetchReady: true
      });
    }
  }

  const logUserOut = () => {
    setUsername('');
    setToken('');
    localStorage.setItem("uDetails", '');
    setApiData({
      ...apiData,
      allCredentials: [],
      fetchReady: true
    });
  }

  useEffect(() => {
    // logs in, if user did not logged out
    const loggedUserJSON = window.localStorage.getItem('uDetails');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setToken(user.token);
      setUsername(user.username);
      setAdmin(user.admin);
      setTestAccount(user.testAccount);
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
      modeOfUse,
      logUserOut,
      isMobile,
      admin, setAdmin,
      testAccount, setTestAccount
    }}>
      {props.children}
    </Iz4Context.Provider>
  );
}
