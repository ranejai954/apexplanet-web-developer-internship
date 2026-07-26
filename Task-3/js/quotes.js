// ============================================
// QUOTE GENERATOR - ZenQuotes API (100% Working)
// ============================================

// ✅ This API works perfectly with Live Server
const QUOTE_API = 'https://zenquotes.io/api/random';

// ===== DOM Elements =====
const quoteContent = document.getElementById('quoteContent');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const copyQuoteBtn = document.getElementById('copyQuoteBtn');
const tweetQuoteBtn = document.getElementById('tweetQuoteBtn');

let currentQuote = '';
let currentAuthor = '';

// ===== Event Listeners =====
newQuoteBtn.addEventListener('click', getRandomQuote);
copyQuoteBtn.addEventListener('click', copyQuote);
tweetQuoteBtn.addEventListener('click', tweetQuote);

// ===== Get Random Quote =====
async function getRandomQuote() {
    showQuoteLoading();

    try {
        const response = await fetch(QUOTE_API);
        
        if (!response.ok) throw new Error('Failed to fetch quote');
        
        const data = await response.json();
        
        // ZenQuotes returns an array with [ { q: "quote", a: "author" } ]
        currentQuote = data[0].q;
        currentAuthor = data[0].a;

        displayQuote(currentQuote, currentAuthor);
    } catch (error) {
        console.error('Quote error:', error);
        // Use fallback if API fails
        useFallbackQuote();
    }
}

// ===== FALLBACK QUOTES (if API fails) =====
function useFallbackQuote() {
    const fallbackQuotes = [
        { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
        { q: "Innovation distinguishes between a leader and a follower.", a: "Steve Jobs" },
        { q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
        { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
        { q: "The best way to predict the future is to create it.", a: "Peter Drucker" },
        { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
        { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
        { q: "The only impossible journey is the one you never begin.", a: "Tony Robbins" }
    ];
    
    const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    currentQuote = random.q;
    currentAuthor = random.a;
    displayQuote(currentQuote, currentAuthor);
}

// ===== Display Quote =====
function displayQuote(quote, author) {
    quoteContent.innerHTML = `
        <div class="quote-text">
            <i class="fas fa-quote-left"></i>
            ${quote}
            <i class="fas fa-quote-right"></i>
        </div>
        <div class="quote-author">— ${author}</div>
    `;
}

// ===== Copy Quote =====
function copyQuote() {
    if (!currentQuote) {
        showToast('No quote to copy! Generate one first.', 'error');
        return;
    }

    const text = `"${currentQuote}" — ${currentAuthor}`;
    navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('📋 Copied to clipboard!');
    });
}

// ===== Tweet Quote =====
function tweetQuote() {
    if (!currentQuote) {
        showToast('No quote to tweet! Generate one first.', 'error');
        return;
    }

    const text = `"${currentQuote}" — ${currentAuthor}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// ===== UI Helpers =====
function showQuoteLoading() {
    quoteContent.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner"></i>
            <p>Loading quote...</p>
        </div>
    `;
}

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast';
    if (type === 'error') toast.classList.add('error');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Load initial quote =====
getRandomQuote();