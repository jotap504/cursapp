import axios from 'axios';

// NOTE: In production, preference creation should happen on the backend
// to keep your Access Token secure. This is a frontend demonstration.

const MERCADO_PAGO_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;
const MERCADO_PAGO_ACCESS_TOKEN = import.meta.env.VITE_MP_ACCESS_TOKEN;

export const createPreference = async (course, user) => {
    try {
        const payload = {
            items: [
                {
                    id: String(course.id).slice(0, 36),
                    title: course.nombre || 'Curso',
                    description: course.descripcion?.slice(0, 255) || '',
                    quantity: 1,
                    unit_price: parseFloat(course.precio),
                    currency_id: 'ARS',
                },
            ],
            payer: {
                name: user.nombre || user.email?.split('@')[0] || 'Estudiante',
                email: user.email,
            },
            back_urls: {
                success: `${window.location.origin}/mi-cuenta?status=success`,
                failure: `${window.location.origin}/mi-cuenta?status=failure`,
                pending: `${window.location.origin}/mi-cuenta?status=pending`,
            },
            auto_return: 'approved',
        };

        console.log('MP payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post(
            'https://api.mercadopago.com/checkout/preferences',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        // Log the full MP error response to help debug
        console.error('Error creating preference:', error.response?.data || error.message);
        throw error;
    }
};


export const initMP = () => {
    if (window.MercadoPago) return;
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.type = 'text/javascript';
    document.head.appendChild(script);
};
