import { useState, useEffect } from 'react';
import { auth, firestore } from '../lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

export const useUserData = () =>
{
    const [user] = useAuthState(auth)
    const [username, setUsername] = useState(null)

    useEffect(() =>
    {
        let unsubscribe;

        if (user)
        {
            console.log(user.uid)
            const ref = firestore.collection('users').doc(user.uid)
            unsubscribe = ref.onSnapshot((doc) =>
            {
                // console.log(doc.data())
                setUsername(doc.data()?.username)
            })
        } else
        {
            setUsername(null)
        }
    }, [user])
    return {user, username}
}