import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const jwtSecret = process.env.JWT_SECRET || 'clave-secreta-desarrollo'

export interface AuthenticatedRequest extends Request {
    usuario?: JwtPayload & { permisos?: string[] }
}

export function verificarToken(permisosRequeridos?: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const encabezado = req.headers.authorization
        const [tipo, token] = encabezado?.split(' ') ?? []

        if (tipo !== 'Bearer' || !token) {
            return res.status(401).json({ message: 'Token requerido' })
        }

        try {
            const payload = jwt.verify(token, jwtSecret)

            if (typeof payload === 'string') {
                return res.status(401).json({ message: 'Token inválido' })
            }

            const permisosUsuario = (payload as JwtPayload & { permisos?: unknown }).permisos
            if (permisosRequeridos && (!Array.isArray(permisosUsuario) ||
                !permisosRequeridos.every((permiso) => permisosUsuario.includes(permiso)))) {
                return res.status(403).json({ message: 'No tienes permisos para esta ruta' })
            }

            req.usuario = payload as JwtPayload & { permisos?: string[] }
            next()
        } catch {
            return res.status(401).json({ message: 'Token inválido o expirado' })
        }
    }
}

export function verificarCuentaPropia(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const idUsuario = Number(req.params.id_usuario)
    const idUsuarioAutenticado = Number(req.usuario?.sub)

    if (!Number.isInteger(idUsuario) || idUsuarioAutenticado !== idUsuario) {
        return res.status(403).json({ message: 'No puedes modificar otra cuenta' })
    }

    next()
}
