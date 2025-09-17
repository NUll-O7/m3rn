import React from 'react'
import { Route, Router } from 'react-router'

import homePage from './Pages/homePage'
import detailPage from './Pages/detailPage'
import createPage from './Pages/createPage'

const App = () => {
  return (
    <div data-theme='forest'>
      <Router>
        <Route path='/' element={<homePage />} />
        <Route path='/note/:id' element={<detailPage />} />
        <Route path='/create' element={<createPage />} />
      </Router>
    </div>
  )
}

export default App
