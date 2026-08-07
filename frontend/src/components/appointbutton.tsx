interface AppointButtonProps {
    color?: string
    hover?: string
    text?: string;
}

function AppointButton({color = "bg-violet-800", hover = "hover:bg-violet-900", text = "text-violet-200"}: AppointButtonProps) {
    return(
        <button className={`
        ${color} 
        ${hover} 
        ${text}
        font-plusjakarta2
        py-2 
        min-w-10/12
        rounded-full
        my-4
        `}>
            Iniciar sesión
        </button>
    )
}

export default AppointButton;