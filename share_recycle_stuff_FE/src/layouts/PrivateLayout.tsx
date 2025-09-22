import { Outlet } from 'react-router-dom'

const PrivateLayout = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default PrivateLayout
