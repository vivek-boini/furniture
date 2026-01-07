const axios = require('axios');

async function check() {
    try {
        const res = await axios.get('https://furniture-server-04rv.onrender.com/api/products');
        console.log(JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error(e.message);
    }
}
check();
