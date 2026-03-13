const http = require('http');

const makeRequest = (payload) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(payload);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/humanise',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body });
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

async function runTests() {
    console.log('--- RUNNING API TESTS ---');

    // Test 1: Valid payload
    try {
        const res1 = await makeRequest({ text: 'This is a normal sentence that an AI wrote.', strength: 'Light' });
        console.log(`[Test 1 - Valid] Status: ${res1.status}`);
        console.log(`Response length vs original: ${JSON.parse(res1.body).result?.length} vs ${'This is a normal sentence that an AI wrote.'.length}`);
    } catch (e) {
        console.error('Test 1 failed:', e.message);
    }

    // Test 2: Invalid payload (no text)
    try {
        const res2 = await makeRequest({});
        console.log(`[Test 2 - Invalid] Status: ${res2.status} Body: ${res2.body}`);
    } catch (e) {
        console.error('Test 2 failed:', e.message);
    }

    // Test 3: Rate Limiting
    console.log('\n--- TESTING RATE LIMITING ---');
    let successCount = 0;
    let rateLimitCount = 0;
    for (let i = 0; i < 7; i++) {
        const res = await makeRequest({ text: `Message ${i}` });
        if (res.status === 200) successCount++;
        if (res.status === 429) rateLimitCount++;
    }
    console.log(`Successful requests: ${successCount}`);
    console.log(`Rate limited requests (429): ${rateLimitCount}`);

    if (successCount === 5 && rateLimitCount === 2) {
        console.log('✅ Rate limiting works perfectly! (5 req/min)');
    } else {
        console.log('❌ Rate limiting test failed.');
    }
}

runTests();
