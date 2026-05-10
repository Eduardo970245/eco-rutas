-- ================================================================
-- ECO-RUTAS · Esquema de base de datos para Supabase
-- Pega este contenido en Supabase → SQL Editor → Run
-- ================================================================

-- Habilitar extensión PostGIS (consultas geoespaciales)
create extension if not exists postgis;

-- ─── Tabla: routes ───────────────────────────────────────────
create table if not exists routes (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  description      text,
  distance_km      numeric(5,2) not null,
  duration_minutes int not null,
  difficulty       text check (difficulty in ('easy','moderate','hard')) default 'easy',
  geojson          jsonb not null,
  start_lat        numeric(10,7) not null,
  start_lng        numeric(10,7) not null,
  active           boolean default true,
  created_at       timestamptz default now()
);

-- ─── Tabla: pois ─────────────────────────────────────────────
create table if not exists pois (
  id               uuid primary key default gen_random_uuid(),
  route_id         uuid references routes(id) on delete cascade,
  name             text not null,
  description      text not null,
  fun_fact         text,
  category         text default 'general'
                   check (category in ('agua','fauna','flora','historia','general')),
  latitude         numeric(10,7) not null,
  longitude        numeric(10,7) not null,
  trigger_radius_m int default 50,
  order_index      int not null,
  active           boolean default true
);

-- ─── Row Level Security ───────────────────────────────────────
alter table routes enable row level security;
alter table pois    enable row level security;

create policy "Rutas públicas de lectura"
  on routes for select using (active = true);

create policy "POIs públicos de lectura"
  on pois for select using (active = true);

-- ─── Índices ──────────────────────────────────────────────────
create index if not exists pois_route_id_idx on pois(route_id);
create index if not exists pois_order_idx on pois(route_id, order_index);

-- ================================================================
-- DATOS DE EJEMPLO: La Ruta de los Muertos
-- ================================================================

insert into routes (name, description, distance_km, duration_minutes, difficulty,
                    start_lat, start_lng, geojson)
values (
  'La Ruta de los Muertos',
  'Recorre zonas de alto valor ecológico aprendiendo sobre ciclos de vida, biodiversidad y el agua como recurso vital en la Ciénaga de Lerma.',
  4.2, 90, 'easy',
  19.2847, -99.5120,
  '{
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-99.5120, 19.2847],
          [-99.5098, 19.2861],
          [-99.5075, 19.2878],
          [-99.5050, 19.2901],
          [-99.5021, 19.2925],
          [-99.4995, 19.2940]
        ]
      },
      "properties": { "name": "La Ruta de los Muertos" }
    }]
  }'::jsonb
);

with ruta as (select id from routes where name = 'La Ruta de los Muertos' limit 1)
insert into pois (route_id, name, description, fun_fact, category,
                  latitude, longitude, trigger_radius_m, order_index)
values
  ((select id from ruta),
   'La Ciénaga de Lerma',
   'Este humedal es uno de los ecosistemas más importantes del Altiplano Central mexicano. Las ciénagas actúan como "riñones" del ecosistema: filtran agua, absorben contaminantes y regulan el microclima regional.',
   'La Ciénaga de Lerma albergaba más de 140 especies de aves acuáticas. La urbanización no planificada redujo su extensión un 80% en los últimos 50 años.',
   'agua', 19.2861, -99.5098, 50, 1),

  ((select id from ruta),
   'El nacimiento del Río Lerma',
   'Aquí comienza uno de los ríos más largos de México. El Lerma nace en estas tierras y viaja más de 700 km hasta desembocar en el Lago de Chapala.',
   'El Río Lerma era sagrado para los pueblos mazahua y otomí, quienes lo llamaban el lugar donde abundan los árboles.',
   'agua', 19.2878, -99.5075, 50, 2),

  ((select id from ruta),
   'Corredor de aves migratorias',
   'Esta zona es paso obligado de especies que viajan desde Canadá y Estados Unidos cada otoño. El humedal les ofrece alimento y descanso en su largo viaje.',
   'Algunas aves recorren más de 5,000 km en su migración. El pato golondrino puede volar hasta 800 km en un solo día.',
   'fauna', 19.2901, -99.5050, 60, 3),

  ((select id from ruta),
   'Flora endémica del altiplano',
   'El tule y el lirio acuático que ves aquí son especies nativas del Valle de Toluca. Estas plantas crean el hábitat que hace posible toda la cadena alimentaria del humedal.',
   'El tule (Typha domingensis) puede purificar hasta 200 litros de agua por metro cuadrado al año absorbiendo nitratos y fosfatos del agua contaminada.',
   'flora', 19.2925, -99.5021, 50, 4),

  ((select id from ruta),
   'Zona de recarga acuífera',
   'El suelo bajo tus pies actúa como una esponja gigante. El agua que se filtra aquí abastece pozos y manantiales en un radio de decenas de kilómetros.',
   'Un metro cuadrado de humedal puede almacenar hasta 800 litros de agua. Los humedales del planeta almacenan más carbono que todos los bosques tropicales juntos.',
   'agua', 19.2940, -99.4995, 50, 5);
