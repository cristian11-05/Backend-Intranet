
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
    console.log('--- Checking Users ---');
    // Get all users
    const usersRes = await request('/users', 'GET');
    const users = JSON.parse(usersRes.body);
    // Find a user to delete (created by tests preferably, avoid Admin/ID 1 if possible)
    // Let's create a temporary user to delete
    console.log('Creating temp user to delete...');
    const userPayload = JSON.stringify({
        nombre: 'Temp Delete User',
        documento: 'DEL' + Date.now(),
        email: 'del' + Date.now() + '@test.com',
        rol: 'Obrero',
        password: '123'
    });
    const createU = await request('/users', 'POST', userPayload);
    const user = JSON.parse(createU.body);
    console.log('Created User ID:', user.id);

    // Try deleting this user (should succeed as it has no relations)
    console.log('Deleting User (Hard Delete)...');
    const delRes = await request(`/users/${user.id}`, 'DELETE');
    console.log('Delete User Status:', delRes.statusCode);

    // Now verify if it's gone
    const usersRes2 = await request('/users', 'GET');
    const users2 = JSON.parse(usersRes2.body);
    const found = users2.find(u => u.id === user.id);
    if (found) console.log('FAILURE: User still exists after delete.');
    else console.log('SUCCESS: User is gone.');


    console.log('\n--- Checking Comunicados ---');
    // Create a comunicado linked to ADMIN (ID 1 or 3) preferably
    // First get a valid existing user
    const validUser = users[0];
    const comPayload = JSON.stringify({
        titulo: 'Temp Com',
        contenido: 'Content',
        autor_id: validUser.id
    });
    const createC = await request('/comunicados', 'POST', comPayload);
    const com = JSON.parse(createC.body);
    console.log('Created Comunicado ID:', com.id);

    // Filter check: Communicados findAll filters by activo=true.
    // Our delete implementation is currently HARD DELETE.
    console.log('Deleting Comunicado (Hard Delete)...');
    const delCRes = await request(`/comunicados/${com.id}`, 'DELETE');
    console.log('Delete Com Status:', delCRes.statusCode);

    const comRes2 = await request('/comunicados', 'GET');
    const coms2 = JSON.parse(comRes2.body);
    const foundC = coms2.find(c => c.id === com.id);
    if (foundC) console.log('FAILURE: Comunicado still exists.');
    else console.log('SUCCESS: Comunicado is gone.');

    // Now testing CONSTRAINT FAILURE
    // Create User -> Create Comunicado (authored by User) -> Delete User
    console.log('\n--- Checking Constraint Failure ---');
    console.log('1. Creating User with Relations...');
    const userPayload2 = JSON.stringify({
        nombre: 'Rel User',
        documento: 'REL' + Date.now(),
        email: 'rel' + Date.now() + '@test.com',
        rol: 'Obrero'
    });
    const createU2 = await request('/users', 'POST', userPayload2);
    const user2 = JSON.parse(createU2.body);

    console.log('2. Creating Comunicado authored by this User...');
    const comPayload2 = JSON.stringify({
        titulo: 'Rel Com',
        contenido: 'Rel Content',
        autor_id: user2.id
    });
    const createC2 = await request('/comunicados', 'POST', comPayload2);

    console.log('3. Attempting to Delete User...');
    const delRelRes = await request(`/users/${user2.id}`, 'DELETE');
    console.log('Delete Rel User Status:', delRelRes.statusCode);
    console.log('Body:', delRelRes.body);

    if (delRelRes.statusCode === 500) {
        console.log('CONFIRMED: Deletion failed due to constraints (likely).');
    }
}

verify().catch(console.error);
