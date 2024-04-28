import { RequestHandler, Request, Response, NextFunction } from 'express';
import authService from '../../services/auth.service';
import { ErrorHandler } from '../../helpers/error';

const INVALID_REF_TOKEN = "invalid-refreshtoken";


export const registro: RequestHandler = async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;
        const response = await authService.register(nombre, email, password, "user", true);

        return res.status(201).json({
            message: "Usuario creado correctamente.",
            data: response,
        });
    } catch(error) {
        next(error);
    }
};

export const login: RequestHandler = async (req, res, next) => {
    try {
        const result = await authService.login(req.body.email, req.body.password);

        res.status(200)
        .cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            expires: result.refreshTokenExpiryDate,
        })
        .json({
            message: "Logueado correctamente.",
            data: {
                accessToken: result.accessToken,
                usuario_id: result.userId,
                usuario_rol: result.userRole,
                expires_in: result.expiresIn
            },
        });

    } catch(error) {
        next(error);
    }
};

// "invalid-refreshtoken" message in 401 => Interceptor checks this message to avoid trying to refreshToken request again.
export const refreshToken: RequestHandler = async (req, res, next) => {
    try {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            throw new ErrorHandler(401, "No se ha adjuntado token de refresco.", INVALID_REF_TOKEN)
        }

        const result = await authService.refreshToken(refreshToken);

        return res.status(200).json({
            message: "Nuevo accessToken generado correctamente.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = async (req, res, next) => {
    if(req.body.usuario_id) { 
        await authService.logout(req.body.usuario_id);
    }
    return res.status(200).json({
        message: "Deslogueado correctamente.",
    });
};

export const forgotPassword: RequestHandler = async (req, res, next) => { 
    try {
        await authService.forgotPassword(req.body.email);

        res.status(200).json({
            message: "Email enviado correctamente.",
        });
    } catch(error) {
        next(error);
    }
}

export const resetPassword: RequestHandler = async (req, res, next) => {
    try {
        await authService.resetPassword(req.body.usuario_id, req.body.token, req.body.password);
        res.status(200).json({
            message: "Contraseña actualizada correctamente.",
        });
    } catch(error) {
        next(error);
    }
}