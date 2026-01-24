
const http = require('http');

function request(path, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(data ? { 'Content-Length': data.length } : {})
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: body }));
        });

        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function verify() {
    console.log('--- Verifying Comunicados ---');

    // 0. Get Valid User
    const usersRes = await request('/users', 'GET');
    const users = JSON.parse(usersRes.body);
    if (!users.length) process.exit(1);
    const validUserId = users[0].id;
    console.log(`Using User ID: ${validUserId}`);

    // 1. Create
    console.log('Creating Comunicado...');
    const createPayload = JSON.stringify({
        titulo: 'Anuncio Importante',
        contenido: 'Este es el contenido del anuncio.',
        imagen: 'https://via.placeholder.com/150', // URL test
        autor_id: validUserId
    });

    const createRes = await request('/comunicados', 'POST', createPayload);
    console.log('Create Status:', createRes.statusCode);
    const created = JSON.parse(createRes.body);
    console.log('Created body:', created);

    if (createRes.statusCode !== 201) {
        console.error('Failed creation.');
        return;
    }

    const id = created.id;

    // 2. List
    console.log('Listing Comunicados...');
    const listRes = await request('/comunicados', 'GET');
    console.log('List Status:', listRes.statusCode);
    const list = JSON.parse(listRes.body);
    console.log('Count:', list.length);
    const found = list.find(c => c.id === id);
    if (found) {
        console.log('Found created comunicado in list.');
    } else {
        console.error('Did not create comunicado in list?!');
    }

    // 3. Update
    console.log('Updating Comunicado...');
    const updatePayload = JSON.stringify({
        titulo: 'Anuncio Editado',
        activo: true
    });
    const updateRes = await request(`/comunicados/${id}`, 'PUT', updatePayload);
    console.log('Update Status:', updateRes.statusCode);

    // 4. Delete
    // console.log('Deleting Comunicado...');
    // const delRes = await request(`/comunicados/${id}`, 'DELETE');
    // console.log('Delete Status:', delRes.statusCode);
}

verify().catch(console.error);
