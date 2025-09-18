import { Outlet } from 'react-router-dom'

const PrivateLayout = () => {
  return (
    <>
      <div>PrivateLayout</div>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default PrivateLayout
