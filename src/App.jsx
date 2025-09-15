import React from 'react'
import Router from './Components/Router'
import { StateProvider } from './Context/StateProvider'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <StateProvider>
      <Router/>
    </StateProvider>
  )
}

export default App