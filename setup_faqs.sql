CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pregunta TEXT NOT NULL,
    respuesta TEXT NOT NULL,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "FAQs are viewable by everyone" ON public.faqs;
CREATE POLICY "FAQs are viewable by everyone" ON public.faqs
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "FAQs are manageable by admins" ON public.faqs;
CREATE POLICY "FAQs are manageable by admins" ON public.faqs
    USING (EXISTS (
        SELECT 1 FROM public.usuarios
        WHERE id = auth.uid() AND rol = 'admin'
    ));

INSERT INTO public.faqs (pregunta, respuesta, orden) VALUES
('¿Cómo accedo a los cursos una vez comprados?', 'Una vez confirmado el pago, recibirás un correo automático con tus accesos. También podrás verlos inmediatamente en la sección ''Mi Cuenta'' de la plataforma.', 1),
('¿Los cursos tienen certificación?', 'Sí, todos nuestros cursos incluyen un certificado digital de finalización avalado por HolísticaApp y nuestros instructores certificados.', 2),
('¿Necesito conocimientos previos?', 'La mayoría de nuestros cursos introductorios están diseñados para principiantes. En la descripción de cada curso detallamos si se requiere alguna base previa.', 3),
('¿Qué medios de pago aceptan?', 'Aceptamos todas las tarjetas de crédito y débito a través de Mercado Pago, así como efectivo en puntos de pago (Rapipago, Pago Fácil) y transferencias.', 4)
ON CONFLICT DO NOTHING;
