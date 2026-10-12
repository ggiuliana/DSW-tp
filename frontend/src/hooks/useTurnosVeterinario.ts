import { useState } from "react";

export const useTurnosVeterinario = (onCrear: (fecha: string, hora: string) => Promise<void>) => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("09:00");
  const [creando, setCreando] = useState(false);

  const crear = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreando(true);
    try {
      await onCrear(fecha, hora);
      setFecha("");
    } catch {
      return;
    } finally {
      setCreando(false);
    }
  };

  return { fecha, setFecha, hora, setHora, creando, crear };
};