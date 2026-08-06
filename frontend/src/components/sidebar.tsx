import { useState } from "react";
import AppointButton from "./appointbutton";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2 text-2xl text-purple-700">☰</button>

      {open && (<div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 z-40"/>)}

      <aside
        className={`
          fixed top-0 left-0 z-50
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
          <a href="#" className="text-lg hover:text-violet-950 text-violet-800">
            Inicio
          </a>

          <a href="#" className="text-lg hover:text-violet-950 text-violet-800">
            Nosotros
          </a>

          <a href="#" className="text-lg hover:text-violet-950 text-violet-800">
            Contacto
          </a>

          <AppointButton />
        </nav>
        <div className="mt-auto p-6 flex justify-center">
            <img src="./public/logoVet.png" alt="logo de veterinaria" className="w-full h-auto"></img></div>
      </aside>
    </>
  );
}

export default Sidebar;