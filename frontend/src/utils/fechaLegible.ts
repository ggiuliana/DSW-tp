export function fechaLegible(fecha: string) {
    return new Date(`${fecha.slice(0, 10)}T00:00:00`).toLocaleDateString("es-AR", { dateStyle: "long" });
}