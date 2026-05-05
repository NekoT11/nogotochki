import { Route, Routes } from 'react-router-dom'
import { Reg } from './component/Reg'
import { Auth } from './component/Auth'

function App() {
  return (
    <>
     <Routes>
        <Route path='/' element={<Reg/>}/>
        <Route path='/auth' element={<Auth/>}/>
     </Routes>
    </>
  )
}

export default App