import Sidebar from './sidebar'

function Header() {
    return(
     <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-3 py-2 h-20 flex items-center">
        <Sidebar />
        <img src="./public/logoVet.png" alt="logo de veterinaria" className="w-auto absolute left-1/2 -translate-x-1/2 h-full rounded-full"></img>
      </header>
    )
}

export default Header;