export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { q, limit = 50 } = req.query;

    const params = new URLSearchParams({
        q: q || "notebook",
        limit: limit.toString()
    });

    const url = `https://api.mercadolibre.com/sites/MLB/search?${params.toString()}`;

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
