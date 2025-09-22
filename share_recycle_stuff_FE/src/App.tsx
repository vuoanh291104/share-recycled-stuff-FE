import Routes from './routes/Routes'
import './App.css'
import { ConfigProvider } from 'antd'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Quicksand, sans-serif',
        },
      }}
    >
      <Routes />
    </ConfigProvider>
  )
}

export default App
