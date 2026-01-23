async function testUserCreation() {
    const newUser = {
        dni: "98765432",
        email: "maycol@gmail.com",
        password: "password123",
        name: "maycol",
        area: "Tecnología",
        status: "ACTIVO",
        role: "USER"
    };

    try {
        console.log('🚀 Intentando crear usuario...');
        const createRes = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        const createData = await createRes.json();
        console.log('✅ Usuario creado:', createData);

        console.log('\n🚀 Intentando login con el nuevo usuario...');
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dni: newUser.dni,
                password: newUser.password
            })
        });
        const loginData = await loginRes.json();
        console.log('✅ Login exitoso:', loginData);

        if (loginData.access_token) {
            console.log('📱 Acceso desde APP MÓVIL confirmado!');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testUserCreation();
