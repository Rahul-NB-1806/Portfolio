# Portfolio

My personal developer portfolio — a cinematic, desk-scene themed site built with React and a small Express/AI backend. It showcases my projects, skills, experience, and resume, and pulls live data from GitHub.

**Live:** _add your deployed link here_

## ✨ Features

- **Cinematic desk-scene hero** with an AI-analyzed background — the backend sends the hero image to a vision model (via NVIDIA's API) to extract dominant colors, mood, and object bounding boxes, which drive the ambient animation and particle effects.
- **Paper-stack style navigation** with smooth scroll and a scroll-progress bar.
- **Dark / light theme toggle** (`ThemeContext.jsx`).
- **Config-driven content** — all personal info, skills, and projects live in a single `config.js`, so the site can be updated without touching component code.
- **Live GitHub section** that pulls repo data directly from the GitHub API.
- **In-browser resume viewer** and downloadable PDF resume.
- **Sections:** Hero, About, Skills, Projects, Experience, Education, Certifications, GitHub, Connect, Contact.

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- Plain CSS (no framework) for the custom cinematic styling

**Backend**
- Node.js + Express
- `needle` for HTTP calls to the AI vision API
- `dotenv` for environment config
- `cors` for cross-origin requests

## 📁 Project Structure

```
Portfolio/
├── backend/
│   ├── server.js          # Express API — image analysis & object detection endpoints
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar, Hero, About, Skills, Projects, Experience,
│   │   │                  # Education, Certifications, GitHubSection, Connect,
│   │   │                  # Contact, Footer, ResumeViewer, AIAnalysis, ProjectModal
│   │   ├── hooks/          # useScrollAnimation, useTypingEffect
│   │   ├── config.js       # All portfolio content (name, skills, projects, links)
│   │   ├── ThemeContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── vite.config.js
└── package-lock.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

```bash
# clone the repo
git clone https://github.com/Rahul-NB-1806/Portfolio.git
cd Portfolio

# install frontend deps
cd frontend
npm install

# install backend deps
cd ../backend
npm install
```

### Environment Variables

Create a `.env` file inside `backend/`:

```
PORT=3001
NVIDIA_API_KEY=your_nvidia_api_key_here
```

### Running Locally

Run frontend and backend together (from `frontend/`):

```bash
npm run dev:full
```

Or run them separately:

```bash
# Frontend (Vite dev server)
cd frontend
npm run dev

# Backend (Express API)
cd backend
npm run dev
```

### Build for Production

```bash
cd frontend
npm run build
```

## 📄 Customizing Content

All personal details — name, roles, contact info, skills, and the project list (with descriptions, tech stack, features, and links) — live in [`frontend/src/config.js`](frontend/src/config.js). Update this file to personalize the site without touching component logic.

## 📬 Contact

- **Email:** rahulnb1806@gmail.com
- **GitHub:** [@Rahul-NB-1806](https://github.com/Rahul-NB-1806)
- **LinkedIn:** [rahul-n-b-308763411](https://www.linkedin.com/in/rahul-n-b-308763411)

## 📝 License

This project is open source and available for personal reference. Feel free to fork it for your own portfolio, but please swap out the personal content in `config.js` first.
