import './App.css'
import Sidebar from './components/sidebar'

function App() {
  return (
    <div className="min-h-screen bg-purple-50 flex">

      <header className="bg-purple relative shadow-md px-3 py-2 w-full h-20 flex flex-row items-center align-middle">
        <Sidebar />
        <img src="./public/logoVet.png" alt="logo de veterinaria" className="w-auto absolute left-1/2 -translate-x-1/2 h-full rounded-full"></img>
      </header>


      
    </div>
  )
  
}

export default App
