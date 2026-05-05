export default async function handler(req, res) {
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
        const {
            q = "notebook",
            limit = 20,
            sort,
            shipping,
            condition,
            category
        } = req.query;

        const params = new URLSearchParams({
            q,
            limit: limit.toString()
        });

        if (sort) params.append('sort', sort);
        if (shipping) params.append('shipping', shipping);
        if (condition) params.append('condition', condition);
        if (category) params.append('category', category);

        const url = `https://api.mercadolibre.com/sites/MLB/search?${params.toString()}`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();

            return res.status(response.status).json({
                error: "Erro na API",
                details: errorText
            });
        }

        const data = await response.json();

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            error: "Erro interno",
            message: error.message
        });
    }
}
