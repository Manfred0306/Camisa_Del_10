# Propuesta A — Premium Minimal (ver localmente)

Instrucciones rápidas para ver la versión `index_altA.html` en tu máquina.

Opciones:

- Abrir el archivo directamente en el navegador: doble clic en `Camisadel10/index_altA.html`.
- Servir con Python (recomendado para evitar problemas de CORS con fetch):

```powershell
cd "C:\Users\brand\OneDrive - Universidad Fidélitas\Documentos\GitHub\Camisa_Del_10\Camisadel10"
python -m http.server 8000
# luego abrir http://localhost:8000/index_altA.html
```

- Usar Live Server en VSCode: instalar la extensión Live Server y abrir `index_altA.html`, luego «Open with Live Server».

Notas:
- Las imágenes referenciadas están en la carpeta `img/index/`. Si alguna no carga, verifica los nombres y rutas.
- `styles.altA.css` contiene el estilo mobile-first y el efecto "derretido" en bordes de imágenes.
