export const auth = (permisos = []) => {
    return (req, res, next) => {
        permisos = permisos.map(perm => perm.toLowerCase());

        if (permisos.includes("public")) {
            return next();
        }

        if (!req.user?.rol) {
            res.setHeader(`Content-Type`, `application/json`);
            return res.redirect(`/login?error=No hay usuarios autenticados`);
        }

        const rolUsuario = req.user.rol.toLowerCase();

        if (!permisos.includes(rolUsuario)) {
            res.setHeader(`Content-Type`, `application/json`);
            return res.redirect(`/productos?error=Privilegios INSUFICIENTES para acceder al recurso`);
        }

        return next();
    };
};
