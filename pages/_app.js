import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'
import {UserContext} from '../lib/UserContext'
import {useUserData} from '../lib/hooks'

function MyApp({ Component, pageProps }) {
  
  const userValue = useUserData()

  return (
    <>
      <UserContext.Provider value={userValue}>
        <Navbar/>
        <Component {...pageProps} />
        <Toaster/>
      </UserContext.Provider>
    </>
    )
  
}

export default MyApp
