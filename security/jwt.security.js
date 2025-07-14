const axios = require('axios');


async function jwtVerify(req, res, next) {
    if(!process.env.AUTH_SERVER_URL){
        next();
        return ;
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'FORBIDDEN' });

    try {
        // Forward the token to the auth server
        const response = await axios.get(process.env.AUTH_SERVER_URL, {
            headers: {
                Authorization: authHeader
            }
        });

        if (response.status === 200 && response.data.message && response.data.result) {
            // Token is valid
            next();
        } else {
            res.status(403).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error('Auth validation failed:', error.response?.data || error.message);
        res.status(403).json({ message: 'Unauthorized' });
    }
}

module.exports = {
    jwtVerify
};