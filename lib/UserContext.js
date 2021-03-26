import React, {useContext} from 'react'

export const UserContext = React.createContext({ user: null, username: null })

export const useUserContext = () =>
{
    return useContext(UserContext)
}
