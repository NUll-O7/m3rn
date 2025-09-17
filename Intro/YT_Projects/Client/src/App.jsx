import {Route, Routes} from 'react-router'
import React from 'react'
import toast from 'react-hot-toast'

import homePage from './pages/Homepage.jsx'
import createPage from './pages/Create.jsx'
import detailsPage from './pages/Details.jsx'

function App() {
  return (
    <>
    <button>Click Me</button>
      <Routes>
        <Route path='/' element={<homePage />} />
        <Route path='/create' element={<createPage />} />
        <Route path='/note/:id' element={<detailsPage />} />
      </Routes>
    </>
  )
}
export default App;