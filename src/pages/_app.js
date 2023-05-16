import '@/styles/globals.css'
import { DeleteContextProvider } from '../../Context/DeleteContext'

export default function App({ Component, pageProps }) {
  return<DeleteContextProvider>
     <Component {...pageProps} />
  </DeleteContextProvider>
}
