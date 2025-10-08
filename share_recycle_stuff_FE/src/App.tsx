import Routes from './routes/Routes'
import './App.css'
import { ConfigProvider } from 'antd'
import { MessageProvider } from './context/MessageProvider'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Quicksand, sans-serif',
        },
      }}
    >
      <MessageProvider>
        <Routes />
      </MessageProvider>
    </ConfigProvider>
  )
}

export default App
