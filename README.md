# Historia Clínica — frontend Angular

Frontend adaptado al backend `../HistoriaClinica` (Java 21 y Spring Boot).

## Ejecutar

1. Iniciar Oracle y verificar `HistoriaClinica/src/main/resources/application-dev.yaml`. La conexión actual utiliza `localhost:1522/freepdb1`.
2. Desde `HistoriaClinica`, ejecutar `./mvnw.cmd spring-boot:run` en Windows o `mvn spring-boot:run` si Maven está instalado. La API escucha en el puerto 8080. Si falla el wrapper, ejecutar desde el IDE con Java 21 o una instalación de Maven.
3. Desde esta carpeta, ejecutar:

```powershell
npm install
npm start
```

4. Abrir http://localhost:4200.

## Módulos

- Especialidades: crear, editar y desactivar.
- Procedimientos: código, nombre, tarifa, duración y especialidad.
- Pacientes: DNI, datos personales, contacto y estado.
- Atenciones: registrar varios procedimientos; consultar por paciente, estado y fechas; ordenar, ver detalles y anular.
- Reportes: actividad por especialidad y procedimientos más realizados; excluyen atenciones anuladas.

Registrar primero las especialidades, los procedimientos y los pacientes. Las nuevas atenciones requieren pacientes y procedimientos activos. El servidor calcula las tarifas y los totales. Desactivar conserva los registros y el historial.

## Conexión con la API

En desarrollo, `environment.development.ts` usa `/api/v1`; `proxy.conf.json` reenvía las solicitudes a `http://localhost:8080`. Reiniciar `npm start` después de modificar el proxy.

En producción, ajustar `src/environments/environment.ts` al servidor de destino. CORS admite `http://localhost:4200` y `http://127.0.0.1:4200`; añadir el origen del despliegue en `WebConfig.java` si corresponde.

| Recurso                                          | Operaciones                                              |
| ------------------------------------------------ | -------------------------------------------------------- |
| `/api/v1/pacientes`                              | GET, POST; GET/PUT/DELETE `/{id}`; GET `/dni/{dni}`      |
| `/api/v1/especialidades`                         | GET, POST; GET/PUT/DELETE `/{id}`                        |
| `/api/v1/procedimientos`                         | GET, POST; GET/PUT/DELETE `/{id}`                        |
| `/api/v1/atenciones`                             | GET con filtros, POST; GET `/{id}`; PATCH `/{id}/anular` |
| `/api/v1/reportes/atenciones-por-especialidad`   | GET con `desde` y `hasta` opcionales                     |
| `/api/v1/reportes/procedimientos-mas-realizados` | GET con `desde` y `hasta` opcionales                     |

DELETE desactiva los catálogos y pacientes. Las fechas usan `yyyy-MM-dd` e incluyen todo el día final. Atenciones acepta `pacienteId`, `estado`, `desde`, `hasta`, `ordenarPor` (`fecha`, `id`, `total`, `estado`) y `direccion` (`asc`, `desc`).

## Verificar

```powershell
npm run build
npm test -- --watch=false
```

Desde `HistoriaClinica`, `mvn test` ejecuta las pruebas con H2 en memoria: no requiere Oracle ni modifica la base de desarrollo. La integración recorre creación de catálogos, registro de paciente y atención, filtros, reportes, validación, anulación y desactivación.
