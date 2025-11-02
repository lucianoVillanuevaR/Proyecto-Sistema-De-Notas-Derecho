export function guardiaRol(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "No autenticado" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "No autorizado" });
    }
    next();
  };
}

export default guardiaRol;

