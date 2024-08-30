export default function handler(req, res) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not found' });
    }
    res.status(200).json({ apiKey });
}