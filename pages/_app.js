import '../styles/globals.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import { useEffect } from 'react';
import { serverTimestamp, doc, setDoc } from "firebase/firestore";


function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth)
  useEffect(() => {
    if (user) {
      async function setData() {
        await setDoc(doc(db, 'users', user.uid), {
          username: user.email,
          displayName: user.displayName,
          lastSeen: serverTimestamp(),
          photoURL: user.photoURL,
        })
      }
      setData();
    }
  }, [user])

  if (loading) return <Loading />
  if (!user) return <Login />

  return <Component {...pageProps} />
}

export default MyApp
