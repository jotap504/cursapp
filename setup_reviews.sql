-- Borramos la tabla si existe para asegurar que las relaciones (Foreign Keys) se creen de cero correctamente
DROP TABLE IF EXISTS public.resenas CASCADE;

CREATE TABLE public.resenas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comentario TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(curso_id, usuario_id)
);

ALTER TABLE public.resenas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.resenas;
CREATE POLICY "Reviews are viewable by everyone" ON public.resenas
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enrolled users can create reviews" ON public.resenas;
CREATE POLICY "Enrolled users can create reviews" ON public.resenas
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.inscripciones
            WHERE curso_id = resenas.curso_id AND usuario_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update their own reviews" ON public.resenas;
CREATE POLICY "Users can update their own reviews" ON public.resenas
    FOR UPDATE USING (auth.uid() = usuario_id);

-- Update courses with average rating logic could be added here or calculated on the fly.
