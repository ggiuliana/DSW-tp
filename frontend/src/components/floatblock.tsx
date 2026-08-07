interface FloatBlockProps {
    titulo: string;
    contenido: string;
    icono: string;
    color: string;
}

function FloatBlock({ titulo, contenido, icono, color }: FloatBlockProps) {
    return (
        <div className="flex md:flex-col items-start align-top place-content-between gap-4 rounded-2xl shadow-xl p-6 border border-gray-300 md:w-1/3 md:min-h-62.5 h-full">
            <div className={`flex items-center align-top bg-orange-200 rounded-2xl p-3 gap-3 ${color}`} >
                <img src={`${icono}`} alt = {`${titulo}`} className="max-w-12"></img>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="font-plusjakarta-bold text-xl">{titulo}</h2>
                <p className="text-gray-700 wrap-break-word">{contenido}</p>
            </div>
        </div>
    )
}

export default FloatBlock;