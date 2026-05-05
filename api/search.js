// Vercel Serverless Function para buscar produtos no Mercado Livre (SEM autenticação)

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 📥 Query params
        const {
            q = "notebook",
            limit = 50,
            sort,
            shipping,
            condition,
            category
        } = req.query;

        // 🔧 Montar parâmetros
        const params = new URLSearchParams({
            q,
            limit: limit.toString()
        });

        if (sort) params.append('sort', sort);
        if (shipping) params.append('shipping', shipping);
        if (condition) params.append('condition', condition);
        if (category) params.append('category', category);

        // 🌐 Endpoint público do Mercado Livre
        const url = `https://api.mercadolibre.com/sites/MLB/search?${params.toString()}`;

        // 🚀 Requisição
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro na API:', response.status, errorText);

            return res.status(response.status).json({
                error: "Erro ao buscar produtos",
                status: response.status,
                details: errorText
            });
        }

        const data = await response.json();

        // 🎯 Retorno
        return res.status(200).json(data);

    } catch (error) {
        console.error('❌ Erro interno:', error);

        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
}
