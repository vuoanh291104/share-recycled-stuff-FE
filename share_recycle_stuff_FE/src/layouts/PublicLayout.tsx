import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <>
      <div>PublicLayout</div>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default PublicLayout
