function Login(){
    return(
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-xl border-2 border-gray-300 p-4">
                <div className="flex items-center gap-3">
                    <img
                        src="./icons/ingresar.png"
                        alt="logo de veterinaria"
                        className="w-8 h-8"
                    />
                    <h2 className="text-xl font-plusjakarta text-purple-950">
                        Inicio de sesión
                    </h2>
                </div>

                <p className="mt-3 font-plusjakarta2 text-gray-600">
                    Accede a registros médicos y próximas citas.
                </p>

                <form className="mt-6 flex flex-col gap-4">
                    <input
                        type="user"
                        placeholder="Nombre de usuario"
                        className="border-2 bg-violet-50 border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 font-plusjakarta"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="border-2 bg-violet-50 border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 font-plusjakarta"
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded-full bg-purple-950 px-4 py-2 font-plusjakarta2 text-violet-200 hover:bg-violet-900"
                        >
                            Ingresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;