import './App.css'
import Header from './components/header'
import AppointButton from './components/appointbutton'
import FloatBlock from './components/floatblock'
import Footer from './components/footer'
import AlignedText from './components/alignedtext'

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-purple-50 flex flex-col items-center gap-4">

      <Header />

      <div className="flex flex-col items-center justify-center pt-25">

        <div className="w-full max-w-7xl flex flex-col items-center justify-center gap-4 md:gap-12 md:flex-row md:justify-between md:px-20">

          <div className="w-full flex flex-col items-center justify-center md:min-w-0 px-4 py-6 md:px-8 md:gap-4 ">

            <div className="inline-flex items-center gap-2 justify-center rounded-full bg-violet-200 px-4 py-1 w-fit mx-4 md:mx-0 mt-4">
              <img src="./icons/escudo.png" alt="logo de veterinaria" className="max-w-4"></img>
              <h3 className="font-plusjakarta2 text-sm text-violet-900">ACOMPAÑANDO A MÁS DE 5.000 DUEÑOS</h3>
            </div>
            <div className="flex flex-col items-center justify-center  mt-8 md:mt-2 pb-6 ">
              <h1 className="font-plusjakarta2 text-4xl text-center md:mb-1">Cuidado compasivo</h1>
              <h2 className="font-plusjakarta text-center text-3xl text-violet-900 mt-2 ">para tus compañeros amados</h2>
              <p className="text-center font-plusjakarta2 mt-12 mx-6 md:mx-0 ">Brindando atención veterinaria experta con un toque suave. Porque su bienestar es nuestra prioridad.</p>
            </div>

          </div>

          <div className="w-full flex flex-col items-center justify-center my-8 bg-white rounded-xl shadow-xl p-6 md:px-8 gap-4">
              <h3 className="font-plusjakarta text-lg text-violet-950 text-shadow-3xs text-center">Para agendar un turno, inicia sesión</h3>
              <AppointButton />
          </div>

        </div>

        <div id="servicios" className="flex flex-col md:flex-row bg-white items-center px-4 md:px-8 py-12 justify-center gap-6 mt-6 scroll-mt-16">
          <FloatBlock 
          titulo="Chequeos" 
          contenido="Exámenes físicos completos para mantener a tu mascota sana y feliz." 
          icono="./icons/botiquin.png" 
          color="bg-violet-200" />

          <FloatBlock 
          titulo="Cirugías" 
          contenido="Intervenciones quirúrgicas seguras y efectivas realizadas por veterinarios profesionales." 
          icono="./icons/cirugia.png" 
          color="bg-orange-200" />

          <FloatBlock 
          titulo="Vacunas" 
          contenido="Programas de inmunización completas para proteger la salud de su mascota." 
          icono="./icons/jeringuilla.png" 
          color="bg-purple-200" />
        </div>
        
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-20 md:gap-8 lg:gap-30 bg-violet-800 py-12">
          <AlignedText titulo="+15k" descripcion="MASCOTAS FELICES" />
          <AlignedText titulo="24/7" descripcion="ATENCIÓN DE EMERGENCIA" />
          <AlignedText titulo="+25" descripcion="VETERINARIOS ESPECIALISTAS" />
          <AlignedText titulo="4.9/5" descripcion="SATISFACCIÓN DE CLIENTES" />
        </div>

        <div id="contacto" className="bg-white w-full p-6 scroll-mt-16">
          <div className="flex flex-col gap-5 bg-amber-900 text-center rounded-xl p-15">
            <div className="flex flex-col items-center justify-center gap-4">
              <h2 className="text-white text-3xl font-plusjakarta">¿Listo para darle a tu mascota el mejor cuidado?</h2>
              <p className="text-white font-plusjakarta2">Comienza ahora mismo</p>
            </div>
            <div className="flex items-center justify-center ">
              <AppointButton color="bg-white" hover="hover:bg-orange-300" text="text-orange-900" />
            </div>
          </div>
        </div>

        <Footer />

      </div>
    </div>
  )
  
}

export default App
