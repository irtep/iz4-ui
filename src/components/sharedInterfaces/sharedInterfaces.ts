export interface FetchSettings {
  method: string
  headers?: any
  body?: string
}

export interface CredentialsTypes {
  id?: number
  page: string
  username: string
  password: string
}

export interface ApiData {
  allCredentials: CredentialsTypes[]
  error: string
  fetchReady: boolean
}

export interface SelectedProps {
  id?: number | string
  action: string
}

export interface UserPswChangeData {
  token: string
  oldPassword: string
  newPassword: string
}