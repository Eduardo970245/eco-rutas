# 🌿 Eco-Rutas

App móvil de rutas de caminata sustentables para la región de Lerma, Estado de México.
Guía al usuario por puntos de interés ecológico con información educativa en tiempo real.

---

## Stack tecnológico

- **React Native** con Expo SDK 51
- **TypeScript** strict mode
- **Expo Router** v3 (navegación por archivos)
- **react-native-maps** (mapa + trazado GeoJSON)
- **expo-location** (GPS en tiempo real)
- **Supabase** (PostgreSQL + RLS, sin autenticación)
- **Zustand** (estado global liviano)
- **AsyncStorage** (progreso de ruta persistente)

---

## Requisitos previos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli eas-cli`
- Para iOS: Xcode (solo Mac)
- Para Android: Android Studio + AVD configurado

---

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env con tu URL y anon key de Supabase

# 3. Configurar base de datos
# Ve a Supabase → SQL Editor y pega el contenido de supabase_schema.sql
```

---

## Correr la app

```bash
# iOS Simulator (solo Mac)
npx expo run:ios

# Android Emulator
npx expo run:android

# Dispositivo físico con Expo Go
npx expo start
```

---

## Estructura del proyecto

```
eco-rutas/
├── app/                    # Pantallas (Expo Router)
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Splash / bienvenida
│   ├── routes/
│   │   ├── index.tsx       # Lista de rutas + mapa
│   │   └── [id].tsx        # Detalle de ruta
│   └── navigation/
│       └── [id].tsx        # Navegación activa + GPS
├── src/
│   ├── components/
│   │   ├── map/            # RouteMap, POIMarker, UserMarker
│   │   ├── route/          # RouteCard, POITimeline
│   │   ├── navigation/     # DirectionBanner, ProgressBar
│   │   └── sheets/         # POIBottomSheet
│   ├── hooks/              # useLocation, useGeofence, useNearbyRoutes, useRouteProgress
│   ├── services/           # routes.service, progress.service
│   ├── store/              # routeStore, locationStore (Zustand)
│   ├── types/              # route.types, location.types
│   └── lib/                # supabase, constants, geo.utils
├── supabase_schema.sql     # Schema + datos de ejemplo
├── app.json
├── .env.example
└── tsconfig.json
```

---

## Flujo de la app

1. **Splash** → usuario toca "Explorar rutas"
2. **Lista de rutas** → GPS se activa, se cargan rutas cercanas desde Supabase
3. **Detalle de ruta** → info previa, itinerario de POIs, botón "Iniciar"
4. **Navegación activa** → mapa en tiempo real, dirección al siguiente POI
5. **Geofencing** → al acercarse a un POI (~50m), se abre el modal educativo automáticamente
6. **Progreso** → se guarda localmente; si el usuario cierra la app, retoma donde dejó

---

## Agregar nuevas rutas

Solo inserta filas en las tablas de Supabase — no requiere cambios en el código:

```sql
-- Nueva ruta
insert into routes (name, description, distance_km, duration_minutes,
                    difficulty, start_lat, start_lng, geojson)
values ('Nombre de la ruta', 'Descripción...', 3.5, 60, 'easy',
        19.XXXX, -99.XXXX, '{"type":"FeatureCollection","features":[...]}'::jsonb);

-- POIs de la ruta
insert into pois (route_id, name, description, fun_fact, category,
                  latitude, longitude, trigger_radius_m, order_index)
values ((select id from routes where name = 'Nombre de la ruta'),
        'Nombre del POI', 'Descripción educativa...', 'Dato curioso...',
        'agua', 19.XXXX, -99.XXXX, 50, 1);
```

---

## Probar el geofencing en simulador

**iOS Simulator:** `Features → Location → Custom Location`
**Android Emulator:** `Extended Controls (...) → Location`

Coordenadas de Lerma para simular:
- Inicio: `lat: 19.2847, lng: -99.5120`
- POI 1 (La Ciénaga): `lat: 19.2861, lng: -99.5098`

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase |

---

## Próximos pasos sugeridos

- [ ] Modo offline: descargar ruta antes de salir
- [ ] Narración por audio en cada POI
- [ ] Galería de fotos por POI
- [ ] Insignias al completar rutas
- [ ] EAS Build para distribución
