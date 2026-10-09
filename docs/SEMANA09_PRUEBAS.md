# Semana 09 — Pruebas y entrega

Abrir el proyecto SEMANA9/tarea05, iniciar Oracle y la API en 8080; iniciar este frontend en 4200. Preparar al menos tres clientes activos y cinco productos activos con stock. Abrir F12 → Red, filtrar Fetch/XHR y conservar el registro. Utilizar datos de prueba identificables.

| Nº | Prueba | Evidencia esperada |
|---|---|---|
| 1 | Revisar sin cliente ni productos | Validaciones; no confirmación ni POST. |
| 2 | Buscar cliente sin tilde y luego texto inexistente | Huamán aparece con huaman; aviso vacío; inactivos excluidos. |
| 3 | Agregar producto y cantidad 3 | Subtotal precio × 3; total instantáneo. |
| 4 | Agregar dos productos con Enter y quitar uno | Cambian líneas y total; no se envía el formulario. |
| 5 | Agregar nuevamente un producto elegido | En la venta: n; aumenta cantidad sin duplicar fila. |
| 6 | Cantidad mayor que stock | Mensaje de stock; revisión bloqueada. |
| 7 | Corregir y revisar | Resumen con cliente, productos y total estimado. |
| 8 | Pulsar Volver | Conserva detalle; no POST. |
| 9 | Confirmar | POST 201; comprobante y mensaje de éxito. |
| 10 | Comparar estimado y comprobante | Mismos totales si no cambian los precios. |
| 11 | Marcar imprimir al registrar | Diálogo y vista previa sin menú ni botones, con DNI y pie. |
| 12 | Imprimir una venta ANULADA desde la consulta | Comprobante y vista previa con ANULADA. |
| 13 | Filtrar e imprimir consulta | Vista previa con filtros, tabla sin botones y total sin anuladas de la página. |
| 14 | Abrir Productos tras vender | Stock disminuido en las cantidades vendidas. |
| 15 | Abrir dos pestañas con las últimas unidades | Primera 201; segunda 409; no hay segunda venta ni stock negativo. |
| 16 | Consultar por cliente y fechas | GET ventas/buscar con solo filtros llenos y página; aparece la venta. |
| 17 | Invertir desde/hasta | Mensaje local; ninguna petición nueva. |

En la prueba 15 cargar ambas pestañas antes de confirmar la primera. La segunda debe conservar el stock antiguo para provocar el conflicto del servidor. Para disponer de una venta ANULADA, usar PATCH /api/v1/ventas/{id}/anular desde Swagger sobre una venta de prueba; luego verificar la devolución del stock.

## Reporte autónomo

Abrir Reportes, consultar un rango válido y comparar montos y unidades por categoría. Verificar un rango sin resultados y fechas invertidas. Las ventas anuladas no se incluyen. Confirmar que la suma de las filas coincide con el total mostrado.

## Lista de entrega

- Rama feature/ventas-<apellido>, al menos cuatro commits y solicitud hacia develop.
- Módulo Ventas integrado, comprobante imprimible, consulta paginada y reporte por categoría.
- PDF Apellido_LP2_S9_Practica.pdf con las 17 evidencias. Incluir Red donde corresponda y las vistas previas de impresión de los casos 11, 12 y 13.
- Repetir con Oracle y comprobar persistencia al recargar. Las capturas temporales con H2 no acreditan Oracle.
