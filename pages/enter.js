import {auth, googleAuthProvider} from '../lib/firebase'
import {useUserContext} from '../lib/UserContext'
import debounce from 'lodash.debounce'
import {firestore} from '../lib/firebase'
import {useState, useEffect, useCallback} from 'react'

const Enter = () =>
{
    const { user, username } = useUserContext()
    // 1. user signed out <SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
    return (
        <main>
        {
            user
                ? !username
                    ? <UsernameForm />
                    : <SignOutButton />
                :  <SignInButton/>
        }
        </main>
    )
}

const SignInButton = () =>
{
    const signInWithGoogle = async () =>
    {
        await auth.signInWithPopup(googleAuthProvider)
    }
    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} /> Sign in with Google
        </button>
    )
}

const SignOutButton = () =>
{
    return (
        <button onClick = {()=> auth.signOut()} >Sign Out</button>
    )
}

const UsernameForm = () =>
{
    const [formValue, setFormValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [isValid, setIsValid] = useState(false)

    const { user, username } = useUserContext()
    
    const onSubmit = async(e) =>
    {
        e.preventDefault()
        
        // Make references to firestore documents
        const userDoc = firestore.doc(`users/${user.uid}`)
        const usernameDoc = firestore.doc(`usernames/${formValue}`)

        const batch = firestore.batch()

        // Commit both docs together as a batch write.
        batch.set(userDoc, { username: formValue, displayName: user.displayName, photoURL: user.photoURL })
        batch.set(usernameDoc, { uid: user.uid })
        
        await batch.commit()
    }

    const onChange = (e) =>
    {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase()
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
        
        // Set form value only if username length < 3 OR it passes the regex
        if (val.length < 3)
        {
            setFormValue(val)
            setLoading(false)
            setIsValid(false)
        }
        if (re.test(val))
        {
            setFormValue(val)
            setLoading(true)
            setIsValid(false)
        }
    
    }

    useEffect(() =>
    {
        checkUsername(formValue)
    },[formValue])

    // Hit the database after each debounced change
    // useCallback hook is used to make debounce work

    const checkUsername = useCallback(
        debounce(async (username) =>
        {
            if (username.length >= 3)
            {
                const ref = firestore.doc(`usernames/${username}`)
                const {exists} = await ref.get()
                console.log('Firestore read was just executed !')
                setIsValid(!exists)
                setLoading(false)
            }
        }, 500),
        []
    )

    return (
        !username &&
            <section>
                <h3>Choose username</h3>
                <form onSubmit = {onSubmit} >
                    <input onChange={onChange} value={formValue} name="username" type="text" />
                    <UsernameMessage username={username} loading={loading} isValid={isValid} />
                    <button className="btn-green" disabled={!isValid} type="submit" >Choose</button>
                    <h3>Debug state</h3>
                    <div>
                        Username : {formValue}
                        <br />
                        Loading : {loading.toString()}
                        <br />
                        Username valid : {isValid.toString()}
                    </div>
                </form>
            </section>
        
    )
}

export default Enter

const UsernameMessage = ({ username, loading, isValid }) =>
{
    if (loading)
    {
        return ( <p>Checking....</p> )
    } else if(isValid) {
        return ( <p className="text-success"> {username} is available ! </p> )
    } else if (username && !isValid)
    {
        return ( <p className="text-danger"> That username is taken ! </p> )
    } else
    {
        return ( <p></p> )
    }
}
