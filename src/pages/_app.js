import "../styles/globals.css";
import { DeleteContextProvider } from "../../Context/DeleteContext";
import { EditContextProvider } from "../../Context/EditContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from "../../firebase";
// import 'antd/dist/reset.css'; 
import {
  MonthContextProvider,
  ShowMonthContextProvider,
} from "../../Context/ShowMonthContext";
import { AssetDataContextProvider } from "../../Context/AssetDataContext";
import { ReceiptContextProvider } from "../../Context/CashupReciept";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Only redirect to dashboard if user is on the login page
        if (router.pathname === "/") {
          router.push("/dashboard");
        }
      } else {
        // Only redirect to login if user is trying to access protected routes
        const publicRoutes = ["/"]; // Add other public routes here
        if (!publicRoutes.includes(router.pathname)) {
          router.push("/");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router.pathname]);

  // Show loading while checking auth
  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <DeleteContextProvider>
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
  );
}
