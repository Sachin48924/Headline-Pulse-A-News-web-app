const API_KEY = "2566b80515b143a4a7f09fd8fbaa5d03";
const url = "https://newsapi.org/v2/everything?q=";

// Define categories and their search queries
const categories = {
    ipl: "cricket IPL",
    finance: "business finance economy",
    politics: "politics government",
    entertainment: "entertainment movies music celebrity",
    general: "general breaking news"
};

// Add loading indicator
function showLoading() {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = '<div class="loading">Loading news...</div>';
}

// Add error handling
function showError(message) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = `<div class="error">${message}</div>`;
}

window.addEventListener('load', () => fetchNews("general"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        showLoading();
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.status === "error") {
            throw new Error(data.message || "Failed to fetch news");
        }
        if (!data.articles || data.articles.length === 0) {
            showError("No news found for this topic");
            return;
        }
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
        showError("Failed to load news. Please try again later.");
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description || "No description available";

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

function onNavItemClick(id) {
    // Update active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.id === id) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    const query = categories[id] || id;
    fetchNews(query);
}

// Add search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
});

// Add enter key functionality for search
searchText.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const query = searchText.value;
        if (!query) return;
        fetchNews(query);
    }
});
