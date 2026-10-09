# PharmaSoft — Semana 09

Frontend Angular conectado al backend `../tarea05`, dentro de `C:\UNIVERSIDAD\LP2\SEMANA9`. No ejecutar la copia de SEMANA5.

## Ejecutar con Oracle

1. Iniciar Oracle en `localhost:1522/freepdb1`. Revisar el esquema en `tarea05/src/main/resources/application-dev.yaml`.
2. Abrir tarea05 de SEMANA9 en IntelliJ, recargar Maven y ejecutar `Actividad01Application` con Java 21. Alternativa: `mvnw.cmd spring-boot:run`.
3. Verificar http://localhost:8080/swagger-ui.html.
4. En este frontend, ejecutar `npm.cmd install` si faltan dependencias y `npm.cmd start`.
5. Abrir http://localhost:4200. El proxy redirige `/api/**` al backend en 8080.

## Semana 09

- Productos: catálogo con categoría, precio, stock, estado, altas, edición, búsqueda y eliminación.
- Ventas: buscadores por nombre/DNI/categoría sin distinguir tildes; solo clientes activos y productos activos con stock.
- FormArray de detalle, cantidades enteras positivas, subtotales y total estimado con signals, validación de stock y acumulación de productos repetidos.
- Revisión y confirmación separadas. Volver no registra. El POST contiene solo clienteId, productoId y cantidad.
- Comprobante con total definitivo del servidor, DNI, estado y sello ANULADA. Impresión opcional al registrar y desde la consulta.
- Consulta con cliente, estado y fechas, validación del rango, paginación del servidor y total registrado de la página sin anuladas.
- Reporte de ventas por categoría con rango de fechas, unidades y montos; excluye anuladas e incluye impresión.

Categorías y Clientes mantienen sus operaciones de la semana 07.

## Contratos de tarea05

Clientes, Categorías y Productos devuelven arrays. GET `/api/v1/ventas/buscar` devuelve ahora una página con `contenido`, `pagina`, `tamanio`, `totalElementos`, `totalPaginas`, `primera` y `ultima`. Acepta pagina/tamanio, clienteId, estado, desde/hasta, ordenarPor/direccion. GET `/api/v1/ventas` mantiene el array original.

El stock de venta se descuenta mediante un UPDATE condicional en una transacción. Si falla una línea, se revierte toda la venta y el stock. La anulación bloquea la venta y devuelve stock una sola vez. Las pruebas simultáneas verifican que dos cajas no venden las mismas últimas unidades.

## Comprobación automática

Frontend:

```powershell
npm.cmd run build
npm.cmd test -- --watch=false
```

Backend:

```powershell
.\mvnw.cmd test
```

Las pruebas del backend usan el perfil test con H2 en memoria, sin modificar Oracle. Cubren arranque, categorías, cálculo de venta, stock, rollback, concurrencia, filtros, paginación, anulación y reportes.

## Evidencias y entrega

Consultar `docs/SEMANA09_PRUEBAS.md` para las 17 pruebas del PDF y el reporte autónomo. Usar F12 → Red para capturar método, URL y estado HTTP cuando corresponda. Las pruebas de impresión requieren revisar la vista previa del navegador: sin menú/botones, con DNI/pie, estado ANULADA y filtros/total de página.

El informe de semana 07 es una entrega distinta. Las capturas de semana 09 se identifican como pruebas con H2 temporal; repetirlas con Oracle para acreditar persistencia en la base del curso.
