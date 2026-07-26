// ============================================
// DAY 1-3: Learning Async JavaScript
// Run this in browser console or with Node.js
// ============================================

console.log('===== LEARNING ASYNC JAVASCRIPT =====');

// ===== 1. CALLBACKS =====
console.log('\n--- 1. CALLBACKS ---');

function fetchDataCallback(callback) {
    console.log('Fetching data with callback...');
    setTimeout(() => {
        const data = { id: 1, name: 'TechNova' };
        callback(data);
    }, 1000);
}

fetchDataCallback((data) => {
    console.log('Callback received:', data);
});

// ===== 2. PROMISES =====
console.log('\n--- 2. PROMISES ---');

function fetchDataPromise() {
    return new Promise((resolve, reject) => {
        console.log('Fetching data with Promise...');
        setTimeout(() => {
            const success = true;
            if (success) {
                resolve({ id: 2, name: 'TechNova Promise' });
            } else {
                reject('Failed to fetch data');
            }
        }, 1000);
    });
}

fetchDataPromise()
    .then(data => console.log('Promise resolved:', data))
    .catch(error => console.log('Promise rejected:', error));

// ===== 3. ASYNC/AWAIT =====
console.log('\n--- 3. ASYNC/AWAIT ---');

async function fetchDataAsync() {
    try {
        console.log('Fetching data with Async/Await...');
        const data = await fetchDataPromise();
        console.log('Async/Await received:', data);
        return data;
    } catch (error) {
        console.log('Async/Await error:', error);
    }
}

fetchDataAsync();

// ===== 4. FETCH API =====
console.log('\n--- 4. FETCH API ---');

async function fetchFromAPI() {
    try {
        console.log('Calling real API...');
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await response.json();
        console.log('API Response:', data);
    } catch (error) {
        console.log('API Error:', error);
    }
}

fetchFromAPI();

// ===== 5. ABORT CONTROLLER =====
console.log('\n--- 5. ABORT CONTROLLER ---');

async function fetchWithAbort() {
    const controller = new AbortController();
    const signal = controller.signal;

    // Abort after 2 seconds
    setTimeout(() => {
        console.log('Aborting request...');
        controller.abort();
    }, 2000);

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', { signal });
        const data = await response.json();
        console.log('Data received before abort:', data);
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request was aborted!');
        } else {
            console.log('Error:', error);
        }
    }
}

fetchWithAbort();

console.log('\n✅ All examples complete! Open browser console to see results.');