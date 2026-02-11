async function registerTestUser() {
    try {
        const payload = {
            documento: '60922277',
            nombre: 'Usuario Test Mobile',
            rol: 'empleado',
            estado: 'Activo'
        };
        console.log('Registering user with payload:', payload);
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log('Registration status:', response.status);
        console.log('Registration success:', data);
    } catch (error) {
        console.error('Registration failed:', error.message);
    }
}

registerTestUser();
