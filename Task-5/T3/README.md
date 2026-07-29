# 🌐 Task 3: API Integration & Dynamic Content

## 📌 Project Overview

This project consists of **three API-powered web applications** integrated into a single dashboard called **API Apps Hub**. It demonstrates the use of REST APIs, JavaScript Fetch API, asynchronous programming, DOM manipulation, local storage, and responsive web design.

Users can easily navigate between all three applications from a single landing page.

---

## 🖼️ Main Hub Preview

![API Apps Hub](screenshots/main-hub.png)

The hub provides quick access to:

- 🌤️ Weather App
- 🎬 Movie Search App
- 💬 Quote & User App

It also showcases the key features and APIs used throughout the project.

---

## 🚀 Live Demo

> Run the project locally using **VS Code Live Server**.

---

# 📱 Applications Included

## 🌤️ 1. Weather App

Search real-time weather information for any city around the world.

### Features

- Current Weather
- 5-Day Forecast
- Search by City
- Current Location (Geolocation)
- Celsius/Fahrenheit Toggle
- Recent Searches (localStorage)

### API Used

- OpenWeatherMap API

### Screenshot

![Weather App](screenshots/weather-app.png)

---

## 🎬 2. Movie Search App

Search movies, TV series, and episodes with detailed information.

### Features

- Search by Title
- Filter by Year
- Filter by Type
- Movie Details Modal
- IMDb Link
- Favorites (localStorage)

### API Used

- OMDb API

### Screenshot

![Movie Search App](screenshots/movie-app.png)

---

## 💬 3. Quote Generator & Random User

Generate motivational quotes and random user profiles.

### Features

- Random Quotes
- Copy Quote
- Tweet Quote
- Random User Generator
- Save Contacts
- Download Contact as vCard

### APIs Used

- Quotable API
- RandomUser API

### Screenshot

![Quote & User App](screenshots/quotes-user-app.png)

---

# 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Website Structure |
| CSS3 | Styling & Responsive Design |
| JavaScript (ES6+) | Functionality |
| Fetch API | API Requests |
| Async/Await | Asynchronous Programming |
| Local Storage | Save User Data |
| Font Awesome | Icons |
| OpenWeatherMap API | Weather Data |
| OMDb API | Movie Information |
| Quotable API | Quotes |
| RandomUser API | Random Users |

---

# 📁 Project Structure

```
T3/
│
├── index.html
├── weather.html
├── movies.html
├── quotes.html
├── learn.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── config.js
│   ├── config.sample.js
│   ├── weather.js
│   ├── movies.js
│   ├── quotes.js
│   ├── randomuser.js
│   └── learn.js
│
├── screenshots/
│   ├── main-hub.png
│   ├── weather-app.png
│   ├── movie-app.png
│   └── quote-user-app.png
│
├── .gitignore
└── README.md
```

---

# 🔐 API Keys Setup

## Step 1

Get your free API keys.

| API | Key Required |
|------|--------------|
| OpenWeatherMap | ✅ |
| OMDb | ✅ |
| Quotable | ❌ |
| RandomUser | ❌ |

---

## Step 2

Copy

```
js/config.sample.js
```

to

```
js/config.js
```

and add your keys.

```javascript
const CONFIG = {
    WEATHER_API_KEY: "YOUR_OPENWEATHER_KEY",
    MOVIE_API_KEY: "YOUR_OMDB_KEY"
};

window.CONFIG = CONFIG;
```

⚠️ Never upload `config.js` to GitHub.

---

# ▶️ How to Run

### Using Live Server

1. Open project in VS Code
2. Install Live Server
3. Right-click `index.html`
4. Click **Open with Live Server**

---

# 🧪 Testing Guide

## Weather App

- Search any city
- Toggle °C / °F
- Use current location
- View 5-day forecast

---

## Movie Search

- Search movie title
- Filter by year
- Filter by type
- Add favorites
- View movie details

---

## Quote & User

- Generate quote
- Copy quote
- Tweet quote
- Generate user
- Save contact
- Download vCard

---

# 📊 Feature Status

| Module | Status |
|---------|--------|
| Weather App | ✅ |
| Movie Search | ✅ |
| Quote Generator | ✅ |
| Random User | ✅ |
| Responsive Design | ✅ |
| Local Storage | ✅ |

---

# 🎯 Learning Outcomes

Through this project I learned:

- REST APIs
- Fetch API
- Async/Await
- JSON Parsing
- Error Handling
- DOM Manipulation
- Responsive UI Design
- Local Storage
- API Integration
- JavaScript ES6+

---

# 📸 Screenshots

## 🏠 Main Hub

![Main Hub](screenshots/main-hub.png)

---

## 🌤️ Weather App

![Weather App](screenshots/weather-app.png)

---

## 🎬 Movie Search

![Movie Search](screenshots/movie-app.png)

---

## 💬 Quote & User

![Quote & User](screenshots/quotes-user-app.png)

---

# 🏆 Task Progress

| Task | Status |
|------|--------|
| Task 1 – HTML & CSS | ✅ Complete |
| Task 2 – JavaScript | ✅ Complete |
| **Task 3 – API Integration** | ✅ Complete |
| Task 4 – Backend | ⏳ Upcoming |
| Task 5 – Full Stack | ⏳ Upcoming |

---

# 🚀 Future Improvements

- Dark / Light Mode
- Search History
- Better Animations
- More API Integrations
- PWA Support
- Deployment

---

# 👨‍💻 Author

**Jai Rane**

Web Development Intern

- **GitHub:** https://github.com/ranejai954
- **LinkedIn:** https://www.linkedin.com/in/jai-rane-62ba58352/

---

# 🙏 Acknowledgements

Special thanks to:

- OpenWeatherMap API
- OMDb API
- Quotable API
- RandomUser API
- Font Awesome
- Google Fonts

for providing free resources and APIs used in this project.

---

# 📄 License

This project was created for educational and internship purposes.

---

## ⭐ If you found this project helpful, consider giving it a star!

**Built with ❤️ during my Web Development Internship.**