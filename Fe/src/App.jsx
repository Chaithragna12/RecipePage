// import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Login from "./Components/login/Login"
import Signup from "./Components/signup/Signup"
import Add from './Components/add/Add'
// import EditRecipeForm from './Components/edit/Edit'
import HomePage from './Components/Home/Home'
// import Student from './Components/student/Student'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Signup/>} />
        <Route path='/login' element={<Login/>}/>
        {/* <Route path='/home' element={<Student/>} /> */}
        <Route path='/add' element={<Add/>}/>
        {/* <Route path='/edit' element={<EditRecipeForm/>}/> */}
        <Route path='/home' element={<HomePage/>}/>
      </Routes>
    </div>
  )
}

export default App