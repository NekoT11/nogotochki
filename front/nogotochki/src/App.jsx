import { Route, Routes } from 'react-router-dom'
import { Reg } from './component/Reg'
import { Auth } from './component/Auth'
import { Requests } from './component/Requests.jsx' 
import { CreateRequest } from './component/CreateRequest.jsx'

function App() {
  return (
    <>
     <Routes>
       <Route path="/" element={<Reg />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reg" element={<Reg />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/create-request" element={<CreateRequest />} />

     </Routes>
    </>
  )
}

export default App