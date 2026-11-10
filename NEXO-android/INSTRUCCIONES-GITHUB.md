# NEXO — paquete para GitHub Actions (método 50/50)

## Qué contiene
El proyecto original de NEXO, conservado, con la capa inicial de SQLite para Android y el workflow que compila un APK de depuración en GitHub Actions.

## Cómo subirlo
1. En GitHub abre `gemasjallaza-cmd/NEXO`.
2. Cambia a la rama `android-sqlite-migration` (no `main`).
3. Entra en **Add file → Upload files**.
4. Extrae este ZIP en tu computadora y arrastra el CONTENIDO de la carpeta extraída a la página de GitHub. Deben aparecer `index.html`, `package.json`, `src/` y `.github/` entre los archivos.
5. Confirma el commit directamente en `android-sqlite-migration`.

## Cómo descargar el APK
1. Abre la pestaña **Actions** del repositorio.
2. Entra en **Build NEXO Android APK**.
3. Espera a que termine el trabajo.
4. En la parte inferior de la ejecución, descarga el artefacto `NEXO-Android-debug-APK`.

## Importante
- No subas esto a `main`.
- Este workflow genera un APK `debug`, para pruebas, no un APK firmado de distribución.
- La compilación en GitHub comprueba que el proyecto compila; aún hace falta instalar el APK en Android y probar crear/editar/eliminar clientes, historial, notas, respaldos, importación/exportación y persistencia al cerrar/abrir.
- La base de datos SQLite usa SQLCipher incluso con cifrado desactivado. Revisa las obligaciones de exportación de cifrado que puedan aplicar a la distribución de la app.
