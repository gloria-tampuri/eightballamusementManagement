import '@/styles/globals.css'
import { DeleteContextProvider } from '../../Context/DeleteContext'
import { EditContextProvider } from '../../Context/EditContext'
import { useEffect } from "react";
import { useRouter } from "next/router";
import firebase from "../../firebase"
import { MonthContextProvider, ShowMonthContextProvider } from '../../Context/ShowMonthContext';
import { AssetDataContextProvider } from '../../Context/AssetDataContext';
import { ReceiptContextProvider } from '../../Context/CashupReciept';

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
        if (typeof window !== "undefined") {
          // Only run on the client-side
          router.push("/");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return<DeleteContextProvider>
    <ReceiptContextProvider>
    <ShowMonthContextProvider>
    <MonthContextProvider>
     <EditContextProvider>
      <AssetDataContextProvider>
     <Component {...pageProps} />
      </AssetDataContextProvider>
     </EditContextProvider>
     </MonthContextProvider>
     </ShowMonthContextProvider>
     </ReceiptContextProvider>
  </DeleteContextProvider>
}
