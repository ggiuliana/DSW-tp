import Sidebar from './sidebar'
import AppointButton from './appointbutton'

function Header() {
    return(
     <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-3 py-2 h-20 flex items-center">
        <Sidebar />
        <img src="./public/logoVet.png" alt="logo de veterinaria" className="w-auto absolute left-1/2 -translate-x-1/2 h-full lg:left-1/12 rounded-full"></img>
        <nav className="hidden lg:flex align-middle items-center gap-6 ml-auto lg:right-1/6">
          <a href="#" className="text-lg hover:text-violet-950 text-violet-800">Inicio</a>
          <a href="#servicios" className="text-lg hover:text-violet-950 text-violet-800">Nosotros</a>
          <a href="#contacto" className="text-lg hover:text-violet-950 text-violet-800">Contacto</a>
          <div className="flex items-center justify-center w-50">
            <AppointButton />
          </div>
        </nav>
      </header>
    )
}

export default Header;