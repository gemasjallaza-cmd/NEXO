# NEXO — migración Android (estado)

- Se conserva el `index.html` original completo y sus funciones.
- En Android nativo, la app abre SQLite antes de inicializar la interfaz.
- En navegador/PWA, se conserva `localStorage`.
- En Android no existe fallback silencioso a `localStorage`.
- Las escrituras SQLite se serializan y se intenta vaciarlas al ocultar/cerrar la vista.

## Importante
Esta es una integración de almacenamiento preparada para compilar; todavía requiere `npm install`, `npm run build`, `npx cap add android` (una sola vez), `npx cap sync android` y pruebas reales en un dispositivo Android. No es todavía un APK verificado.

## Comprobaciones necesarias
Crear/editar/eliminar cliente, registrar llamadas y notas, restaurar JSON, importar Excel/CSV, exportar JSON/CSV, cerrar y reabrir la app y verificar persistencia.
