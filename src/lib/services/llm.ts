import { UserInput } from "../types/userInput";

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface GeneratedFile {
  name: string;
  content: string;
  isFolder?: boolean;
}

export const generateWebsiteFiles = async (
  description: string,
  isReactProject: boolean = true,
): Promise<GeneratedFile[]> => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a web development expert. Generate code files for a website based on the user's description. Return a JSON array of file objects with name and content properties.",
          },
          {
            role: "user",
            content: `Create a ${isReactProject ? "React" : "website"} based on this description: ${description}. ${isReactProject ? "Generate all necessary files for a complete React project including package.json, index.html, index.js, App.js, components, CSS files, and any other required files. The project should be a fully functional React application that could be run with npm start." : "Generate all necessary files including HTML, CSS, JavaScript, and any configuration files needed."} Return ONLY a JSON array of objects with 'name' and 'content' properties.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON array from response
    const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback to using Ollama locally if GROQ fails or returns invalid format
    return generateFilesWithOllama(description, isReactProject);
  } catch (error) {
    console.error("Error with GROQ API:", error);
    return generateFilesWithOllama(description, isReactProject);
  }
};

const generateFilesWithOllama = async (
  description: string,
  isReactProject: boolean = true,
): Promise<GeneratedFile[]> => {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: `Create a ${isReactProject ? "React" : "website"} based on this description: ${description}. ${isReactProject ? "Generate all necessary files for a complete React project including package.json, index.html, index.js, App.js, components, CSS files, and any other required files. The project should be a fully functional React application that could be run with npm start." : "Generate all necessary files including HTML, CSS, JavaScript, and any configuration files needed."} Return ONLY a JSON array of objects with 'name' and 'content' properties.`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.response;

    // Extract JSON array from response
    const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // If we can't parse the response, return default files
    return getDefaultFiles(description, isReactProject);
  } catch (error) {
    console.error("Error with Ollama API:", error);
    return getDefaultFiles(description, isReactProject);
  }
};

const getDefaultFiles = (
  description: string,
  isReactProject: boolean = true,
): GeneratedFile[] => {
  if (isReactProject) {
    return [
      {
        name: "package.json",
        content: `{
  "name": "react-project",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`,
      },
      {
        name: "public",
        isFolder: true,
      },
      {
        name: "public/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created based on: ${description}" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,
      },
      {
        name: "src",
        isFolder: true,
      },
      {
        name: "src/index.js",
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      },
      {
        name: "src/index.css",
        content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,
      },
      {
        name: "src/App.js",
        content: `import React from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Main description="${description}" />
      <Footer />
    </div>
  );
}

export default App;`,
      },
      {
        name: "src/App.css",
        content: `.App {
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}`,
      },
      {
        name: "src/components",
        isFolder: true,
      },
      {
        name: "src/components/Header.js",
        content: `import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <h1>React Project</h1>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;`,
      },
      {
        name: "src/components/Header.css",
        content: `.header {
  background-color: #282c34;
  padding: 20px;
  color: white;
}

.header nav ul {
  display: flex;
  list-style: none;
  justify-content: center;
  padding: 0;
}

.header nav ul li {
  margin: 0 15px;
}

.header nav ul li a {
  color: white;
  text-decoration: none;
}

.header nav ul li a:hover {
  text-decoration: underline;
}`,
      },
      {
        name: "src/components/Main.js",
        content: `import React from 'react';
import './Main.css';

function Main({ description }) {
  return (
    <main className="main">
      <section className="hero">
        <h2>Welcome to our React Project</h2>
        <p>This project was created based on: {description}</p>
      </section>
      <section className="content">
        <p>This is a placeholder React application. Customize it according to your needs.</p>
      </section>
    </main>
  );
}

export default Main;`,
      },
      {
        name: "src/components/Main.css",
        content: `.main {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}

.hero {
  margin-bottom: 30px;
}

.hero h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`,
      },
      {
        name: "src/components/Footer.js",
        content: `import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} React Project. All rights reserved.</p>
    </footer>
  );
}

export default Footer;`,
      },
      {
        name: "src/components/Footer.css",
        content: `.footer {
  background-color: #282c34;
  color: white;
  padding: 20px;
  text-align: center;
}`,
      },
    ];
  } else {
    return [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Generated Website</h1>
    <p>Based on: ${description}</p>
  </header>
  <main>
    <p>This is a placeholder website. The LLM service could not generate custom code.</p>
  </main>
  <footer>
    <p>&copy; 2023 Generated Website</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "styles.css",
        content: `body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  color: #333;
}

header {
  background: #4a154b;
  color: white;
  text-align: center;
  padding: 1rem;
}

main {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

footer {
  text-align: center;
  padding: 1rem;
  background: #f4f4f4;
  margin-top: 2rem;
}`,
      },
      {
        name: "script.js",
        content: `document.addEventListener('DOMContentLoaded', () => {
  console.log('Website loaded!');
});
`,
      },
    ];
  }
};
