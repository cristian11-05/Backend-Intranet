
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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function verify() {
    console.log('--- Verifying Update & Soft Delete ---');

    // 1. Create Temp User
    const userPayload = JSON.stringify({
        nombre: 'Update Test User',
        documento: 'UPD' + Date.now(),
        email: 'upd' + Date.now() + '@test.com',
        rol: 'Obrero',
        password: '123'
    });
    const createRes = await request('/users', 'POST', userPayload);
    const user = JSON.parse(createRes.body);
    console.log('Created User ID:', user.id, 'Nombre:', user.nombre);

    // 2. Update User (Nombre)
    console.log('Updating user name to "Updated Name"...');
    const updatePayload = JSON.stringify({
        nombre: 'Updated Name',
        rol: 'Gerente'
    });
    const updateRes = await request(`/users/${user.id}`, 'PATCH', updatePayload); // Frontend likely uses PUT or PATCH. Controller has PATCH.
    const updatedUser = JSON.parse(updateRes.body);
    console.log('Update Status:', updateRes.statusCode);
    console.log('Updated User Name:', updatedUser.nombre);

    if (updatedUser.nombre !== 'Updated Name') {
        console.log('FAILURE: Name did not update.');
    } else {
        console.log('SUCCESS: Name updated.');
    }

    // 3. Soft Delete
    console.log('Soft Deleting User...');
    const delRes = await request(`/users/${user.id}`, 'DELETE');
    console.log('Delete Status:', delRes.statusCode);

    // 4. Verify List (Should NOT be in list)
    console.log('Checking Users List (Active only)...');
    const listRes = await request('/users', 'GET');
    const list = JSON.parse(listRes.body);
    const found = list.find(u => u.id === user.id);

    if (found) {
        console.log('FAILURE: User found in list (Soft Delete check failed or status not filtered).');
        console.log('User State:', found.estado);
    } else {
        console.log('SUCCESS: User not found in active list.');
    }
}

verify().catch(console.error);
