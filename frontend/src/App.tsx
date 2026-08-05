import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-purple-100 flex">
      <header className="bg-white shadow-md px-6 w-full h-20 flex flex-row place-content-between items-center align-middle">
        <img src="./public/logoVet.png" alt="logo de veterinaria" className="w-auto h-full"></img>
        <ul className="flex flex-row gap-4 align-middle items-center">
          <li><a href="#" className="text-gray-700 hover:text-purple-600">Nosotros</a></li>
          <li><a href="#" className="text-gray-700 hover:text-purple-600">Contacto</a></li>
          <li><button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">Iniciar sesión</button></li>
        </ul>
      </header>

      
    </div>
  )
  
}

export default App
