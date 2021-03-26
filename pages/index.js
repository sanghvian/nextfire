import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

export default function Home() {
  return (
    <div className={styles.container}>
      <Link prefetch={false} href={{
        pathname: '/[username]',
        query : {username : 'ankit1841'}
      }}>LINK
      </Link>
      <Loader show={true} />
      <button onClick={()=>toast.success('Cha ching !')} >Toast me</button>
    </div>
  )
}
