-- ============================================================
-- ESQUEMA DE BASE DE DATOS Y POLÍTICAS RLS PARA UVAPRO (SUPABASE)
-- Diseñado para el campo: sin login ni registro obligatorio
-- ============================================================

-- 1. Tabla de progreso y estadísticas del cosechador
CREATE TABLE IF NOT EXISTS public.user_stats (
    id SERIAL PRIMARY KEY,
    streak_days INTEGER DEFAULT 4,
    streak_text TEXT DEFAULT '¡En racha!',
    points INTEGER DEFAULT 340,
    points_delta_text TEXT DEFAULT '+45 hoy',
    route_progress_percent INTEGER DEFAULT 45,
    route_lessons_text TEXT DEFAULT '9/20 lecc.',
    overall_harvest_progress_percent INTEGER DEFAULT 45,
    current_farm_name TEXT DEFAULT 'FUNDO LOS VALLES',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de seguridad para rol 'anon' (acceso sin inicio de sesión)
CREATE POLICY "Permitir lectura publica de estadisticas"
ON public.user_stats
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Permitir actualizacion publica de estadisticas"
ON public.user_stats
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- 4. Registro inicial por defecto para el cosechador en el Fundo Los Valles
INSERT INTO public.user_stats (id, streak_days, streak_text, points, points_delta_text, route_progress_percent, route_lessons_text, overall_harvest_progress_percent, current_farm_name)
VALUES (1, 4, '¡En racha!', 340, '+45 hoy', 45, '9/20 lecc.', 45, 'FUNDO LOS VALLES')
ON CONFLICT (id) DO NOTHING;
