# 🧪 ALMA Finanzas - Plan de Testing Completo

**Versión:** 1.0  
**Fecha:** 2026-02-05  
**Modelo AI:** gemini-3-flash-preview  
**Framework:** Stagehand + Playwright

---

## 📋 Resumen Ejecutivo

ALMA Finanzas es un software de facturación y contabilidad para PyMEs en México. Este plan cubre **testing E2E automatizado con AI** para todas las funciones principales.

**Módulos identificados:**
1. Autenticación
2. Dashboard (Panel Principal)
3. Ingresos
4. Egresos
5. Cotizaciones
6. Facturación
7. Catálogo de Productos
8. Directorio (Clientes/Proveedores)
9. Control Fiscal
10. Nómina
11. Conciliación Bancaria

---

## 🔐 MÓDULO 1: Autenticación

### 1.1 Login
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| AUTH-001 | Login exitoso con credenciales válidas | 🔴 Crítica | Happy Path |
| AUTH-002 | Login fallido - email incorrecto | 🟡 Media | Negative |
| AUTH-003 | Login fallido - password incorrecto | 🟡 Media | Negative |
| AUTH-004 | Login fallido - campos vacíos | 🟡 Media | Validation |
| AUTH-005 | Validación de formato de email | 🟢 Baja | Validation |
| AUTH-006 | Mostrar/ocultar contraseña | 🟢 Baja | UI |
| AUTH-007 | Recordar sesión (persistencia) | 🟡 Media | Functional |
| AUTH-008 | Logout exitoso | 🔴 Crítica | Happy Path |

### 1.2 Recuperación de Contraseña
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| AUTH-009 | Solicitar reset de password | 🟡 Media | Happy Path |
| AUTH-010 | Email de recuperación no existe | 🟡 Media | Negative |

---

## 📊 MÓDULO 2: Dashboard (Panel Principal)

### 2.1 Vista General
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| DASH-001 | Carga correcta del dashboard | 🔴 Crítica | Smoke |
| DASH-002 | Tour de bienvenida aparece (primera vez) | 🟡 Media | Onboarding |
| DASH-003 | Omitir tour funciona | 🟡 Media | UI |
| DASH-004 | Completar tour paso a paso | 🟢 Baja | Onboarding |
| DASH-005 | Selector de año funciona | 🟡 Media | Filter |
| DASH-006 | Botón de refrescar actualiza datos | 🟢 Baja | UI |

### 2.2 Accesos Rápidos
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| DASH-007 | "Crea una Factura" → navega a facturación | 🔴 Crítica | Navigation |
| DASH-008 | "Factura Global" → abre formulario CFDI | 🟡 Media | Navigation |
| DASH-009 | "Registra Compra o Gasto" → navega a egresos | 🔴 Crítica | Navigation |
| DASH-010 | "Recepción de Pago" → registrar cobro | 🟡 Media | Navigation |
| DASH-011 | "Pago a Proveedor" → registrar pago | 🟡 Media | Navigation |
| DASH-012 | "Crear Cliente o Proveedor" → directorio | 🔴 Crítica | Navigation |
| DASH-013 | "Crear Producto o Servicio" → catálogo | 🟡 Media | Navigation |
| DASH-014 | "Crear Cotización" → cotizaciones | 🟡 Media | Navigation |
| DASH-015 | "Conciliación Bancaria" → módulo fiscal | 🟡 Media | Navigation |
| DASH-016 | "Conciliar CFDIs" → validación facturas | 🟡 Media | Navigation |

---

## 💰 MÓDULO 3: Gestión de Ingresos

### 3.1 Listado de Ingresos
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| ING-001 | Mostrar lista de ingresos | 🔴 Crítica | Smoke |
| ING-002 | KPIs correctos (Total, Por Cobrar, IVA, Retenciones) | 🔴 Crítica | Data |
| ING-003 | Filtro por rango de fechas | 🟡 Media | Filter |
| ING-004 | Filtro por mes | 🟡 Media | Filter |
| ING-005 | Filtro por estado (Todos) | 🟡 Media | Filter |
| ING-006 | Filtro por tipo de factura | 🟡 Media | Filter |
| ING-007 | Exportar a CSV | 🟡 Media | Export |
| ING-008 | Buscar por cliente | 🟡 Media | Search |
| ING-009 | Filtrar por categoría | 🟢 Baja | Filter |
| ING-010 | Filtrar por moneda | 🟢 Baja | Filter |
| ING-011 | Ordenar por columnas | 🟢 Baja | Sort |
| ING-012 | Paginación funciona | 🟡 Media | Pagination |

### 3.2 Crear Nuevo Ingreso
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| ING-013 | Crear ingreso con datos mínimos | 🔴 Crítica | Happy Path |
| ING-014 | Crear ingreso con todos los campos | 🔴 Crítica | Happy Path |
| ING-015 | Validación de campos requeridos | 🟡 Media | Validation |
| ING-016 | Seleccionar cliente existente | 🔴 Crítica | Integration |
| ING-017 | Crear cliente desde formulario de ingreso | 🟡 Media | Integration |
| ING-018 | Calcular IVA automáticamente | 🔴 Crítica | Calculation |
| ING-019 | Aplicar retenciones | 🟡 Media | Calculation |
| ING-020 | Agregar múltiples conceptos | 🟡 Media | Functional |
| ING-021 | Cancelar creación de ingreso | 🟢 Baja | UI |

### 3.3 Vincular Factura
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| ING-022 | Vincular factura XML | 🔴 Crítica | Happy Path |
| ING-023 | Vincular factura PDF | 🟡 Media | Happy Path |
| ING-024 | Validar CFDI contra SAT | 🔴 Crítica | Integration |
| ING-025 | Rechazar factura inválida | 🟡 Media | Negative |

### 3.4 Editar/Eliminar Ingreso
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| ING-026 | Ver detalle de ingreso | 🟡 Media | Read |
| ING-027 | Editar ingreso existente | 🟡 Media | Update |
| ING-028 | Eliminar ingreso | 🟡 Media | Delete |
| ING-029 | Marcar como cobrado | 🔴 Crítica | Status |
| ING-030 | Registrar pago parcial | 🟡 Media | Functional |

---

## 💸 MÓDULO 4: Gestión de Egresos

### 4.1 Listado de Egresos
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| EGR-001 | Mostrar lista de egresos | 🔴 Crítica | Smoke |
| EGR-002 | KPIs correctos (Total, Por Pagar, IVA, Retenciones) | 🔴 Crítica | Data |
| EGR-003 | Filtro por rango de fechas | 🟡 Media | Filter |
| EGR-004 | Filtro por mes | 🟡 Media | Filter |
| EGR-005 | Filtro por estado | 🟡 Media | Filter |
| EGR-006 | Filtro por tipo de factura | 🟡 Media | Filter |
| EGR-007 | Exportar a CSV | 🟡 Media | Export |
| EGR-008 | Buscar por proveedor | 🟡 Media | Search |
| EGR-009 | Filtrar por categoría | 🟢 Baja | Filter |

### 4.2 Crear Nuevo Egreso
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| EGR-010 | Crear egreso con datos mínimos | 🔴 Crítica | Happy Path |
| EGR-011 | Crear egreso con todos los campos | 🔴 Crítica | Happy Path |
| EGR-012 | Seleccionar proveedor existente | 🔴 Crítica | Integration |
| EGR-013 | Crear proveedor desde formulario | 🟡 Media | Integration |
| EGR-014 | Calcular IVA acreditable | 🔴 Crítica | Calculation |
| EGR-015 | Vincular factura XML/PDF | 🔴 Crítica | Integration |

### 4.3 Editar/Eliminar Egreso
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| EGR-016 | Ver detalle de egreso | 🟡 Media | Read |
| EGR-017 | Editar egreso existente | 🟡 Media | Update |
| EGR-018 | Eliminar egreso | 🟡 Media | Delete |
| EGR-019 | Marcar como pagado | 🔴 Crítica | Status |

---

## 📝 MÓDULO 5: Cotizaciones

### 5.1 Gestión de Cotizaciones
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| COT-001 | Listar cotizaciones | 🔴 Crítica | Smoke |
| COT-002 | Crear nueva cotización | 🔴 Crítica | Happy Path |
| COT-003 | Agregar productos a cotización | 🔴 Crítica | Functional |
| COT-004 | Calcular totales automáticamente | 🔴 Crítica | Calculation |
| COT-005 | Aplicar descuentos | 🟡 Media | Calculation |
| COT-006 | Enviar cotización por email | 🟡 Media | Integration |
| COT-007 | Descargar cotización PDF | 🟡 Media | Export |
| COT-008 | Convertir cotización a factura | 🔴 Crítica | Integration |
| COT-009 | Duplicar cotización | 🟢 Baja | Functional |
| COT-010 | Cambiar estado de cotización | 🟡 Media | Status |

---

## 🧾 MÓDULO 6: Facturación (CFDI)

### 6.1 Emisión de CFDI
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| FAC-001 | Crear factura CFDI básica | 🔴 Crítica | Happy Path |
| FAC-002 | Timbrar factura con PAC | 🔴 Crítica | Integration |
| FAC-003 | Validar RFC de receptor | 🔴 Crítica | Validation |
| FAC-004 | Seleccionar uso de CFDI | 🔴 Crítica | Functional |
| FAC-005 | Seleccionar método de pago | 🔴 Crítica | Functional |
| FAC-006 | Seleccionar forma de pago | 🔴 Crítica | Functional |
| FAC-007 | Agregar múltiples conceptos | 🟡 Media | Functional |
| FAC-008 | Aplicar impuestos trasladados | 🔴 Crítica | Calculation |
| FAC-009 | Aplicar retenciones | 🟡 Media | Calculation |
| FAC-010 | Generar factura global | 🟡 Media | Happy Path |

### 6.2 Gestión de Facturas
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| FAC-011 | Listar facturas emitidas | 🔴 Crítica | Smoke |
| FAC-012 | Descargar XML de factura | 🔴 Crítica | Export |
| FAC-013 | Descargar PDF de factura | 🔴 Crítica | Export |
| FAC-014 | Enviar factura por email | 🟡 Media | Integration |
| FAC-015 | Cancelar factura | 🔴 Crítica | Functional |
| FAC-016 | Motivo de cancelación requerido | 🟡 Media | Validation |
| FAC-017 | Crear nota de crédito | 🟡 Media | Functional |
| FAC-018 | Crear complemento de pago | 🟡 Media | Functional |

---

## 📦 MÓDULO 7: Catálogo de Productos

### 7.1 Gestión de Productos/Servicios
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| CAT-001 | Listar productos | 🔴 Crítica | Smoke |
| CAT-002 | Crear producto con datos mínimos | 🔴 Crítica | Happy Path |
| CAT-003 | Crear servicio | 🔴 Crítica | Happy Path |
| CAT-004 | Asignar clave SAT | 🔴 Crítica | Functional |
| CAT-005 | Definir precio unitario | 🔴 Crítica | Functional |
| CAT-006 | Definir unidad de medida | 🔴 Crítica | Functional |
| CAT-007 | Configurar impuestos del producto | 🟡 Media | Functional |
| CAT-008 | Editar producto | 🟡 Media | Update |
| CAT-009 | Eliminar producto | 🟡 Media | Delete |
| CAT-010 | Buscar producto por nombre | 🟡 Media | Search |
| CAT-011 | Filtrar por categoría | 🟢 Baja | Filter |

---

## 👥 MÓDULO 8: Directorio (Clientes/Proveedores)

### 8.1 Gestión de Entidades
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| DIR-001 | Listar todas las entidades | 🔴 Crítica | Smoke |
| DIR-002 | Filtrar solo clientes | 🟡 Media | Filter |
| DIR-003 | Filtrar solo proveedores | 🟡 Media | Filter |
| DIR-004 | Buscar por nombre/RFC/email | 🟡 Media | Search |

### 8.2 Crear/Editar Entidades
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| DIR-005 | Crear cliente persona física | 🔴 Crítica | Happy Path |
| DIR-006 | Crear cliente persona moral | 🔴 Crítica | Happy Path |
| DIR-007 | Crear proveedor | 🔴 Crítica | Happy Path |
| DIR-008 | Validar formato de RFC | 🔴 Crítica | Validation |
| DIR-009 | Validar RFC contra SAT | 🟡 Media | Integration |
| DIR-010 | Completar datos fiscales | 🔴 Crítica | Functional |
| DIR-011 | Badge "Fiscal OK" aparece | 🟡 Media | UI |
| DIR-012 | Badge "Incompleto" cuando faltan datos | 🟡 Media | UI |
| DIR-013 | Editar entidad existente | 🟡 Media | Update |
| DIR-014 | Eliminar entidad | 🟡 Media | Delete |
| DIR-015 | Sincronizar con constancia SAT | 🟡 Media | Integration |

---

## 🏦 MÓDULO 9: Control Fiscal

### 9.1 Conciliación Bancaria
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| FIS-001 | Acceder a conciliación bancaria | 🟡 Media | Smoke |
| FIS-002 | Cargar estado de cuenta | 🟡 Media | Import |
| FIS-003 | Match automático de movimientos | 🟡 Media | Functional |
| FIS-004 | Match manual de movimientos | 🟡 Media | Functional |
| FIS-005 | Marcar diferencias | 🟢 Baja | Functional |

### 9.2 Conciliación de CFDIs
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| FIS-006 | Comparar facturas vs registros | 🟡 Media | Functional |
| FIS-007 | Identificar facturas faltantes | 🟡 Media | Validation |
| FIS-008 | Validar estatus ante SAT | 🔴 Crítica | Integration |

---

## 👷 MÓDULO 10: Nómina

### 10.1 Gestión de Nómina
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| NOM-001 | Acceder a módulo de nómina | 🟡 Media | Smoke |
| NOM-002 | Registrar empleado | 🟡 Media | Happy Path |
| NOM-003 | Calcular nómina | 🟡 Media | Calculation |
| NOM-004 | Generar CFDI de nómina | 🟡 Media | Integration |
| NOM-005 | Timbrar recibo de nómina | 🟡 Media | Integration |

---

## ⚙️ MÓDULO 11: Configuración

### 11.1 Configuración de Empresa
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| CFG-001 | Ver datos de la empresa | 🟡 Media | Read |
| CFG-002 | Editar datos fiscales | 🟡 Media | Update |
| CFG-003 | Cargar certificados CSD | 🔴 Crítica | Integration |
| CFG-004 | Configurar PAC | 🔴 Crítica | Integration |
| CFG-005 | Configurar logo de empresa | 🟢 Baja | UI |

### 11.2 Usuarios y Permisos
| ID | Test Case | Prioridad | Tipo |
|----|-----------|-----------|------|
| CFG-006 | Listar usuarios | 🟡 Media | Smoke |
| CFG-007 | Invitar nuevo usuario | 🟡 Media | Happy Path |
| CFG-008 | Asignar rol/permisos | 🟡 Media | Functional |
| CFG-009 | Desactivar usuario | 🟡 Media | Functional |

---

## 📈 Métricas de Cobertura

| Módulo | Tests | Críticos | Medios | Bajos |
|--------|-------|----------|--------|-------|
| Autenticación | 10 | 2 | 7 | 1 |
| Dashboard | 16 | 4 | 10 | 2 |
| Ingresos | 30 | 10 | 15 | 5 |
| Egresos | 19 | 7 | 10 | 2 |
| Cotizaciones | 10 | 4 | 5 | 1 |
| Facturación | 18 | 10 | 7 | 1 |
| Catálogo | 11 | 5 | 4 | 2 |
| Directorio | 15 | 6 | 8 | 1 |
| Control Fiscal | 8 | 1 | 6 | 1 |
| Nómina | 5 | 0 | 5 | 0 |
| Configuración | 9 | 2 | 6 | 1 |
| **TOTAL** | **151** | **51** | **83** | **17** |

---

## 🚀 Plan de Ejecución

### Fase 1: Smoke Tests (Semana 1)
- AUTH-001, AUTH-008
- DASH-001
- ING-001, EGR-001, COT-001, FAC-011, CAT-001, DIR-001

### Fase 2: Happy Paths Críticos (Semana 2-3)
- Todos los tests marcados como 🔴 Crítica

### Fase 3: Flujos Completos (Semana 4-5)
- Flujo E2E: Crear cliente → Crear cotización → Convertir a factura → Timbrar → Cobrar
- Flujo E2E: Registrar proveedor → Registrar egreso → Vincular factura → Pagar

### Fase 4: Tests de Validación y Edge Cases (Semana 6)
- Tests 🟡 Media
- Tests negativos

### Fase 5: Tests de UI y UX (Semana 7)
- Tests 🟢 Baja
- Tests de responsive
- Tests de accesibilidad

---

## 🔧 Configuración Técnica

```javascript
// stagehand.config.js
module.exports = {
  model: 'google/gemini-3-flash-preview',
  env: 'LOCAL',
  localBrowserLaunchOptions: {
    executablePath: '/usr/bin/google-chrome-stable',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  credentials: {
    email: 'oscarmen486@gmail.com',
    password: 'Dorysman1'
  },
  baseUrl: 'https://alma-finanzas.com'
};
```

---

## 📁 Estructura de Archivos

```
/home/ubuntu/alma-testing/
├── PLAN-DE-TESTING.md          # Este documento
├── stagehand.config.js         # Configuración
├── tests/
│   ├── auth/
│   │   ├── login.test.js
│   │   └── logout.test.js
│   ├── dashboard/
│   │   ├── navigation.test.js
│   │   └── widgets.test.js
│   ├── ingresos/
│   │   ├── list.test.js
│   │   ├── create.test.js
│   │   └── vincular.test.js
│   ├── egresos/
│   │   └── ...
│   ├── cotizaciones/
│   │   └── ...
│   ├── facturacion/
│   │   └── ...
│   ├── catalogo/
│   │   └── ...
│   ├── directorio/
│   │   └── ...
│   └── fiscal/
│       └── ...
├── helpers/
│   ├── auth.js                 # Helper de login
│   ├── navigation.js           # Helpers de navegación
│   └── assertions.js           # Validaciones custom
├── fixtures/
│   ├── clientes.json
│   ├── productos.json
│   └── facturas.json
└── reports/
    └── ...
```

---

*Documento generado automáticamente con Stagehand + Gemini 3 Flash*
