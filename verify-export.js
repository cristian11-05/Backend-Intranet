
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/users/export',
    method: 'GET',
};

const req = http.request(options, (res) => {
    let responseBody = '';

    console.log(`StatusCode: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Response Preview:', responseBody.substring(0, 100));
        if (responseBody.includes('ID,Documento,Email')) {
            console.log('SUCCESS: CSV Header found.');
        } else {
            console.log('FAILURE: CSV Header not found.');
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.end();
