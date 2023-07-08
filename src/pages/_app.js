import '@/styles/globals.css'
import { DeleteContextProvider } from '../../Context/DeleteContext'
import { EditContextProvider } from '../../Context/EditContext'

export default function App({ Component, pageProps }) {
  return<DeleteContextProvider>
     <EditContextProvider>
     <Component {...pageProps} />
     </EditContextProvider>
  </DeleteContextProvider>
}
