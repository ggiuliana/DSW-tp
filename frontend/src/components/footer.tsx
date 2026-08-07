function Footer(){
    return(
    <> 
        <div className="flex flex-col items-center justify-center gap-4 bg-violet-100 px-6 py-12 min-w-full">
          <img src="./logoVet.png" alt="logo de veterinaria" className="max-w-24 rounded-full"></img>
          <p className="text-center text-sm text-gray-900">Cuidado veterinario moderno con un enfoque en la calidad humana.</p>
        </div>

        <footer className="bg-violet-100 min-w-full flex p-6 border border-gray-300 place-content-between">
          <p className="text-xs text-center">©2026 Clínica Veterinaria Serene Paws</p>
          <p className="text-xs text-center">Calle Alicia 948, Ciudad Armanda</p>
        </footer>
    </>
    )
}

export default Footer;