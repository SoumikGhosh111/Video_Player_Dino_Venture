import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomePage from './pages/HomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="dark p-0 m-0">
      {/* Wrapping everything in a 'dark' class because 
         YouTube's mobile UI is best represented in Dark Mode.
      */}
      <HomePage />
    </div>
  )
}

export default App
