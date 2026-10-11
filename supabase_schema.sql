-- ============================================================
-- ESQUEMA DE CAPACITACIONES VINCULADO AL PADRÓN OFICIAL DE PURAFRUIT
-- Tabla satélite conectada a: Trabajador (dni Char(8))
-- ============================================================

-- 1. Tabla de avance de capacitación vinculada al DNI oficial del Trabajador
CREATE TABLE IF NOT EXISTS public.capacitacion_trabajador (
    dni_trabajador CHAR(8) PRIMARY KEY REFERENCES public."Trabajador"(dni) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 1,
    streak_text TEXT DEFAULT 'Día 1',
    points_delta_text TEXT DEFAULT '+0 hoy',
    route_progress_percent INTEGER DEFAULT 0,
    route_lessons_text TEXT DEFAULT '0/20 lecc.',
    overall_harvest_progress_percent INTEGER DEFAULT 0,
    completed_modules JSONB DEFAULT '[]'::jsonb,
    completed_lessons JSONB DEFAULT '[]'::jsonb,
    completed_quizzes JSONB DEFAULT '[]'::jsonb,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.capacitacion_trabajador ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Trabajador" ENABLE ROW LEVEL SECURITY;

-- 3. Políticas para que la aplicación en campo pueda consultar el Trabajador por DNI
DROP POLICY IF EXISTS "Permitir consulta de trabajador por DNI" ON public."Trabajador";
CREATE POLICY "Permitir consulta de trabajador por DNI"
ON public."Trabajador"
FOR SELECT
TO anon
USING (true);

-- 4. Políticas para guardar y leer el avance de capacitación
DROP POLICY IF EXISTS "Permitir lectura capacitacion por DNI" ON public.capacitacion_trabajador;
CREATE POLICY "Permitir lectura capacitacion por DNI"
ON public.capacitacion_trabajador
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Permitir upsert capacitacion por DNI" ON public.capacitacion_trabajador;
CREATE POLICY "Permitir upsert capacitacion por DNI"
ON public.capacitacion_trabajador
FOR ALL
TO anon
USING (true)
WITH CHECK (true);


-- Fin del script


