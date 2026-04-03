import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileUpload from './components/FileUpload'
import StockSSE from './components/StockSSE'
import WebsocketStock from './components/WebsocketStock'
import TaskForm from './StructuredFormat/components/TaskForm'
import TaskTable from './StructuredFormat/components/TaskTable'
import AuthLayout from './components/AuthLayout'

const App = () => {
  return (
    <div >
              <ToastContainer position='top-right' autoClose={3000}/>
      <Routes>

        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/verify-email' element={<VerifyEmail/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path="/file-upload" element={<FileUpload/>}/>
        <Route path='/LiveTable' element={<WebsocketStock/>}/>
        <Route path='/stocks' element={<StockSSE/>}/>
        <Route path="/taskForm" element={<AuthLayout><TaskForm/></AuthLayout>}/>
        <Route path='/taskTable' element={<TaskTable />}/>
      </Routes>
    </div>
  )
}

export default App