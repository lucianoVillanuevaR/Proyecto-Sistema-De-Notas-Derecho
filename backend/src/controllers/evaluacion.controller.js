import { AppDataSource } from "../config/configDb.js";

export async function cerrarEvaluacion(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const evalRepo = AppDataSource.getRepository("Evaluation");
    const evaluation = await evalRepo.findOne({ where: { id } });
    if (!evaluation) return res.status(404).json({ message: "Evaluación no encontrada" });

    evaluation.isClosed = true;
    await evalRepo.save(evaluation);


    return res.json({ ok: true, message: "Evaluación cerrada" });
  } catch (e) {
    return res.status(500).json({ message: "Error al cerrar evaluación", error: e.message });
  }
}

// default export (nombre en español)
export default { cerrarEvaluacion };
