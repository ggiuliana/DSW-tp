import { useState } from "react";
import AppointButton from "./appointbutton";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2 text-2xl text-purple-700 lg:hidden">☰</button>

      {open && (<div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden"/>)}

      <aside
        className={`
          fixed top-0 left-0 z-50 lg:hidden
          h-screen w-72
          bg-white
          shadow-xl
          transform transition-transform duration-300
          flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-2xl text-purple-700"
        >
          ✕
        </button>

        <nav className="flex flex-col gap-6 p-8 pt-20">

          <div onClick={() => setOpen(false)}>
            <a href="#" className="text-lg hover:text-violet-950 text-violet-800">
              Inicio
            </a>
          </div>

          <div onClick={() => setOpen(false)}>
            <a href="#servicios" className="text-lg hover:text-violet-950 text-violet-800">
              Nosotros
            </a>
          </div>

          <div onClick={() => setOpen(false)}>
            <a href="#contacto" className="text-lg hover:text-violet-950 text-violet-800">
              Contacto
            </a>
          </div>
        
          <AppointButton />

        </nav>

        <div className="mt-auto p-6 flex justify-center">
            <img src="./public/logoVet.png" alt="logo de veterinaria" className="w-full h-auto"></img>
        </div>

      </aside>
    </>
  );
}

export default Sidebar;