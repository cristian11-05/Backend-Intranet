const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function testPersistence() {
    try {
        console.log('--- Testing User Persistence ---');

        // 1. Create a user
        console.log('1. Creating user...');
        const createRes = await axios.post(`${API_URL}/users`, {
            email: `test_${Date.now()}@example.com`,
            password: 'password123',
            nombre: 'Test User',
            documento: `DNI_${Date.now()}`
        });
        const userId = createRes.data.id;
        console.log(`User created with ID: ${userId}`);

        // 2. Update user
        console.log('2. Updating user...');
        const updateRes = await axios.patch(`${API_URL}/users/${userId}`, {
            nombre: 'Updated Test User',
            rol: 'ADMIN'
        });
        console.log('User updated:', updateRes.data.nombre === 'Updated Test User' ? 'SUCCESS' : 'FAILED');

        // 3. Delete user
        console.log('3. Deleting user...');
        const deleteRes = await axios.delete(`${API_URL}/users/${userId}`);
        console.log('User deleted:', deleteRes.status === 200 ? 'SUCCESS' : 'FAILED');

        console.log('--- Test Finished Successfully ---');
    } catch (error) {
        console.error('Test failed:', error.response ? error.response.data : error.message);
    }
}

testPersistence();
