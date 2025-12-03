import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'


function App() {
  const [count, setCount] = useState(0)
  
  return (
   <BrowserRouter>
    <Navbar />
   
   </BrowserRouter>
  )
}

export default App