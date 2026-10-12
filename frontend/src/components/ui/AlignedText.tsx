function AlignedText({ titulo, descripcion }: { titulo: string; descripcion: string }) {
    return(
        <div className="flex flex-col items-center align-middle justify-center gap-2">
            <h2 className="text-6xl md:text-3xl font-bevietnam text-white">{titulo}</h2>
            <p className="text-center font-bevietnam md:text-sm text-violet-300">{descripcion}</p>
        </div>
    )
}

export default AlignedText;