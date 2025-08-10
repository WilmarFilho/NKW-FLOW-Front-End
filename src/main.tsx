import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import App from './App'

createRoot(document.getElementById('root')!).render(
    <RecoilRoot>
      <App />
    </RecoilRoot>
)