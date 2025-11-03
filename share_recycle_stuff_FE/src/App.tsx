import Routes from './routes/Routes'
import './App.css'
import { ConfigProvider, App as AntApp } from 'antd'
import { MessageProvider } from './context/MessageProvider'
import { NotificationProvider } from './context/NotificationContext'

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
        <NotificationProvider>
          <MessageProvider>
            <Routes />
          </MessageProvider>
        </NotificationProvider>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
