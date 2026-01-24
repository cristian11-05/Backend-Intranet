
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/users',
    method: 'GET',
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        try {
            const users = JSON.parse(body);
            console.log('API Users List:');
            users.forEach(u => {
                console.log(`ID: ${u.id}, Documento: ${u.documento}, Nombre: "${u.nombre}", Rol: ${u.rol}`);
            });
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw body:', body);
        }
    });
});

req.on('error', (e) => console.error(e));
req.end();
