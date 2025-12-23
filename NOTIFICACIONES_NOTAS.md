# Sistema de Notificaciones para Actualización de Notas

## Descripción
El sistema ahora envía notificaciones automáticas cuando:
- Se actualiza una nota existente
- Se asigna una nueva nota
- Se elimina una nota

## Características Implementadas

### Backend
1. **Creación automática de notificaciones** (`user.controller.js`):
   - Cuando un profesor actualiza una nota, se crea una notificación para el estudiante
   - La notificación incluye detalles de los cambios (puntaje, evaluación, tipo, observación)
   - Se registra en el historial para auditoría

2. **Tipos de notificaciones**:
   - `nota_actualizada`: Cuando se actualiza una nota existente
   - `nota_asignada`: Cuando se asigna una nueva calificación
   - `nota_eliminada`: Cuando se elimina una nota

### Frontend
1. **Botón de notificaciones con badge** (`NotificationButton.jsx`):
   - Muestra un contador rojo con el número de notificaciones no leídas
   - Se actualiza automáticamente cada 30 segundos
   - Ubicado en la esquina superior derecha de todas las páginas

2. **Hook personalizado** (`useNotifications.js`):
   - Gestiona el estado global de notificaciones no leídas
   - Sincroniza el contador entre todos los componentes
   - Actualiza automáticamente cuando se marcan notificaciones como leídas

3. **Página de notificaciones mejorada** (`Notificaciones.jsx`):
   - Iconos específicos para cada tipo de notificación:
     * 📊 para notas actualizadas
     * 🗑️ para notas eliminadas
     * 📝 para notas asignadas
   - Colores distintivos por tipo de notificación
   - Filtros: Todas, Sin leer, Leídas
   - Actualización en tiempo real del contador global

4. **Estilos mejorados** (`notificaciones.css`, `NotificationButton.css`):
   - Badge animado con efecto pulse
   - Animación float para el botón de notificaciones
   - Colores específicos para diferentes tipos de notificaciones

## Funcionamiento

1. **Cuando un profesor actualiza una nota**:
   - El backend detecta los cambios y crea una notificación
   - La notificación se guarda en la base de datos
   - El estudiante recibe la notificación en su bandeja

2. **El estudiante ve la notificación**:
   - El badge en el botón de notificaciones muestra el número de notificaciones no leídas
   - Al hacer clic en el botón, se abre la página de notificaciones
   - Puede ver todos los detalles: qué cambió, cuándo y quién lo hizo

3. **Marcar como leída**:
   - El estudiante puede marcar cada notificación como leída
   - El contador se actualiza automáticamente
   - El badge desaparece cuando no hay notificaciones pendientes

## Actualización automática
- El sistema verifica nuevas notificaciones cada 30 segundos
- No requiere recargar la página manualmente
- El contador se sincroniza entre todas las pestañas abiertas
