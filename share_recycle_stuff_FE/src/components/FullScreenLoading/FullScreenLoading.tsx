import {Spin} from 'antd'
const FullScreenLoading = () => {
  return (
    <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backdropFilter: "blur(2px)",
          }}
        >
          <Spin size="large" tip="Đang xử lý..." />
        </div>
  )
}

export default FullScreenLoading
