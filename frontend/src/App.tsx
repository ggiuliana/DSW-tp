import './App.css'
import Header from './components/header'
import FloatLogin from './components/floatlogin'
import AppointButton from './components/appointbutton'

function App() {
  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center gap-4">

      <Header />

      <div className="flex flex-col items-center justify-center pt-25">
        <div className="inline-flex items-center justify-center rounded-full bg-violet-200 px-4  mx-4 mt-4 w-fit">
          <h3 className="font-plusjakarta2 text-sm text-violet-900">ACOMPAÑANDO A MÁS DE 5.000 DUEÑOS</h3>
        </div>

        <div className="flex flex-col items-center justify-center mt-8">
          <h1 className="font-plusjakarta2 text-4xl">Cuidado compasivo</h1>
          <h2 className="font-plusjakarta text-center text-3xl text-violet-900 mt-2">para tus compañeros amados</h2>
          <p className="text-center font-plusjakarta2 mt-12 mx-6">Brindando atención veterinaria experta con un toque suave. Porque su bienestar es nuestra prioridad.</p>
          <AppointButton />
          <FloatLogin />
        </div>
        
      </div>
    </div>
  )
  
}

export default App
