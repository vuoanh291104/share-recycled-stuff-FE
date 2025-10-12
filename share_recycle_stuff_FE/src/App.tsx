import Routes from './routes/Routes'
import './App.css'
import { ConfigProvider, App as AntApp } from 'antd'
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
      <AntApp>
        <MessageProvider>
          <Routes />
        </MessageProvider>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
