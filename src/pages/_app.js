import '@/styles/globals.css'
import { DeleteContextProvider } from '../../Context/DeleteContext'
import { EditContextProvider } from '../../Context/EditContext'
import { useEffect } from "react";
import { useRouter } from "next/router";
import firebase from "../../firebase"

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Check authentication state on initial load
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, redirect to dashboard
        router.push("/dashboard");
      } else {
        // User is signed out, redirect to login page (if needed)
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, []);

  return<DeleteContextProvider>
     <EditContextProvider>
     <Component {...pageProps} />
     </EditContextProvider>
  </DeleteContextProvider>
}
