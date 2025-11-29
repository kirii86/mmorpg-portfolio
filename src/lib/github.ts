// GitHub API utilities
import { getLanguageIcon, getLanguageColor } from "./icons";

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  topics: string[];
  created_at?: string;
  private?: boolean; // Para proyectos privados destacados
}

export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  avatar_url: string;
}

export interface GitHubStats {
  yearsOfExperience: number;
  totalProjects: number;
  technologiesUsed: string[];
  totalStars: number;
  totalForks: number;
}

// Función auxiliar para peticiones con manejo de rate limiting
async function fetchGitHubAPI(url: string): Promise<Response> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Si hay un token de GitHub disponible en variables de entorno, usarlo
  if (typeof process !== "undefined" && process.env?.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Verificar rate limiting
    const remaining = response.headers.get("X-RateLimit-Remaining");
    const resetTime = response.headers.get("X-RateLimit-Reset");

    if (remaining && parseInt(remaining) < 10) {
      console.warn(
        `GitHub API: Only ${remaining} requests remaining. Resets at ${new Date(
          parseInt(resetTime || "0") * 1000
        )}`
      );
    }

    return response;
  } catch (error) {
    console.error("Error in fetchGitHubAPI:", error);
    // Return a failed response object instead of throwing
    return new Response(null, { status: 500, statusText: "Fetch failed" });
  }
}

export async function fetchGitHubRepos(
  username: string
): Promise<GitHubRepo[]> {
  try {
    console.log(`Fetching GitHub repos for user: ${username}`);
    const response = await fetchGitHubAPI(
      `https://api.github.com/users/${username}/repos?sort=stars&per_page=50&direction=desc`
    );
    console.log(`GitHub API response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch repositories. Status: ${response.status}`
      );
    }

    const repos: GitHubRepo[] = await response.json();
    console.log(`Total repos fetched: ${repos.length}`);

    const filteredRepos = repos.filter((repo) => !repo.fork);
    console.log(`Non-fork repos: ${filteredRepos.length}`);
    console.log(
      "Repo names:",
      filteredRepos.map((r) => r.name)
    );

    // Ya viene ordenado por estrellas desde la API
    return filteredRepos;
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    console.log(
      "Using fallback data - this indicates an API issue in production"
    );

    // Fallback completo con todos los proyectos reales de kirii86
    return [
      {
        id: 4,
        name: "codextreme-web",
        description: "Modern web development agency website",
        html_url: "https://github.com/kirii86/codextreme-web",
        homepage: null,
        language: "Astro",
        stargazers_count: 15,
        forks_count: 0,
        fork: false,
        topics: ["astro", "web-agency", "modern"],
      },
      {
        id: 15,
        name: "kc_adminV2",
        description: "Advanced admin system for game servers",
        html_url: "https://github.com/kirii86/kc_adminV2",
        homepage: null,
        language: "Lua",
        stargazers_count: 7,
        forks_count: 0,
        fork: false,
        topics: ["lua", "admin-system", "gaming"],
      },
      {
        id: 14,
        name: "Arctic-Multipurpose-Bot",
        description: "Multipurpose Discord bot with various features",
        html_url: "https://github.com/kirii86/Arctic-Multipurpose-Bot",
        homepage: null,
        language: "JavaScript",
        stargazers_count: 2,
        forks_count: 0,
        fork: false,
        topics: ["discord-bot", "javascript", "multipurpose"],
      },
      {
        id: 1,
        name: "mmorpg-portfolio",
        description: "My personal portfolio website built with Astro",
        html_url: "https://github.com/kirii86/mmorpg-portfolio",
        homepage: null,
        language: "Astro",
        stargazers_count: 0,
        forks_count: 0,
        fork: false,
        topics: ["portfolio", "astro", "typescript", "tailwind"],
      },
      {
        id: 2,
        name: "last_oasis_server_guide_es",
        description: "Complete guide for Last Oasis private servers in Spanish",
        html_url: "https://github.com/kirii86/last_oasis_server_guide_es",
        homepage: null,
        language: "HTML",
        stargazers_count: 0,
        forks_count: 0,
        fork: false,
        topics: ["guide", "gaming", "spanish", "last-oasis"],
      },
      {
        id: 5,
        name: "VIPPlaytime",
        description: "VIP system with playtime tracking for game servers",
        html_url: "https://github.com/kirii86/VIPPlaytime",
        homepage: null,
        language: "C#",
        stargazers_count: 0,
        forks_count: 0,
        fork: false,
        topics: ["csharp", "vip-system", "gaming"],
      },
      {
        id: 6,
        name: "codeflow-portfolio",
        description: "Previous version of my portfolio website",
        html_url: "https://github.com/kirii86/codeflow-portfolio",
        homepage: null,
        language: "TypeScript",
        stargazers_count: 0,
        forks_count: 0,
        fork: false,
        topics: ["portfolio", "typescript", "react"],
      },
      {
        id: 7,
        name: "CodePortfolio",
        description: "Another portfolio iteration",
        html_url: "https://github.com/kirii86/CodePortfolio",
        homepage: null,
        language: "JavaScript",
        stargazers_count: 0,
        forks_count: 0,
        fork: false,
        topics: ["portfolio", "javascript"],
      },
      {
        id: 9,
        name: "Apolo-GYM",
        description: "Gym management website project",
        html_url: "https://github.com/kirii86/Apolo-GYM",
        homepage: null,
        language: "CSS",
        stargazers_count: 0,
        forks_count: 0,
        fork: false,
        topics: ["css", "gym", "website"],
      },
      {
        id: 10,
        name: "React-Portfolio",
        description: "Portfolio built with React and TypeScript",
        html_url: "https://github.com/kirii86/React-Portfolio",
        homepage: null,
        language: "TypeScript",
        stargazers_count: 0,
        forks_count: 0,
        fork: false,
        topics: ["react", "typescript", "portfolio"],
      },
      {
        id: 12,
        name: "Nuevo-Portfolio",
        description: "New portfolio iteration in JavaScript",
        html_url: "https://github.com/kirii86/Nuevo-Portfolio",
        homepage: null,
        language: "JavaScript",
        stargazers_count: 0,
        forks_count: 0,
        fork: false,
        topics: ["javascript", "portfolio"],
      },
      {
        id: 13,
        name: "ArcticOficcial",
        description: "Official website for Arctic bot",
        html_url: "https://github.com/kirii86/ArcticOficcial",
        homepage: null,
        language: "JavaScript",
        stargazers_count: 0,
        forks_count: 0,
        fork: false,
        topics: ["javascript", "website", "discord-bot"],
      },
    ];
  }
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  try {
    const response = await fetchGitHubAPI(
      `https://api.github.com/users/${username}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    // Fallback con datos básicos del usuario
    return {
      login: username,
      name: "kirii86",
      bio: "Passionate developer creating innovative solutions",
      public_repos: 5,
      followers: 10,
      following: 15,
      created_at: "2020-01-01T00:00:00Z",
      avatar_url: `https://github.com/${username}.png`,
    };
  }
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  try {
    // Verificar caché primero (válido por 1 hora) - solo en el cliente
    const cacheKey = `github-stats-${username}`;
    if (typeof window !== "undefined" && window.localStorage) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - timestamp < oneHour) {
          return data;
        }
      }
    }

    // Obtener solo la primera página de repositorios (100 más recientes)
    // Esto reduce significativamente las peticiones a la API
    const response = await fetchGitHubAPI(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&direction=desc`
    );

    if (!response.ok) {
      console.warn(
        `GitHub API returned status ${response.status}, using fallback data`
      );
      throw new Error("Failed to fetch repositories");
    }

    const allRepos: GitHubRepo[] = await response.json();
    const [user] = await Promise.all([fetchGitHubUser(username)]);

    // Filtrar repositorios reales (sin forks, sin repos especiales como .github, pero contar casi todos)
    const realRepos = allRepos.filter(
      (repo) =>
        !repo.fork &&
        repo.name !== ".github" &&
        repo.name !== `${username}.github.io` // Solo filtrar el repo de GitHub Pages si existe
    );

    // Calcular años de experiencia desde el primer repositorio REAL (julio 2019 según dijiste)
    let oldestRepoDate = new Date();
    if (realRepos.length > 0) {
      // Encontrar el repo más antiguo de los obtenidos
      const sortedByDate = realRepos.sort(
        (a, b) =>
          new Date(a.created_at || "").getTime() -
          new Date(b.created_at || "").getTime()
      );
      oldestRepoDate = new Date(
        sortedByDate[0].created_at || "2019-07-08T00:00:00Z"
      );
    } else {
      // Fallback a la fecha de creación de la cuenta
      oldestRepoDate = new Date(user.created_at);
    }

    const now = new Date();
    const yearsOfExperience = Math.max(
      1,
      Math.floor(
        (now.getTime() - oldestRepoDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      )
    );

    // Usar el total de repositorios públicos del usuario directamente desde la API
    const totalProjects = user.public_repos;

    // Obtener tecnologías únicas utilizadas - basándome en tu imagen y lenguajes principales
    const technologies = new Set<string>();

    // Agregar tecnologías principales que veo en tu perfil según la imagen
    const mainTechnologies = [
      "JavaScript",
      "Lua",
      "Astro",
      "TypeScript",
      "CSS",
      "HTML",
      "C#",
      "C++",
    ];

    realRepos.forEach((repo) => {
      // Agregar lenguaje principal del repositorio
      if (repo.language) {
        technologies.add(repo.language);
      }

      // Agregar tecnologías de los topics
      repo.topics?.forEach((topic) => {
        const topicLower = topic.toLowerCase();

        // Mapeo más completo basado en lo que uso
        const techMapping: Record<string, string> = {
          react: "React",
          reactjs: "React",
          vue: "Vue.js",
          vuejs: "Vue.js",
          angular: "Angular",
          nodejs: "Node.js",
          node: "Node.js",
          typescript: "TypeScript",
          javascript: "JavaScript",
          python: "Python",
          php: "PHP",
          go: "Go",
          golang: "Go",
          rust: "Rust",
          docker: "Docker",
          mongodb: "MongoDB",
          mysql: "MySQL",
          postgresql: "PostgreSQL",
          postgres: "PostgreSQL",
          astro: "Astro",
          svelte: "Svelte",
          nextjs: "Next.js",
          nuxt: "Nuxt.js",
          express: "Express.js",
          firebase: "Firebase",
          aws: "AWS",
          tailwindcss: "TailwindCSS",
          bootstrap: "Bootstrap",
          sass: "Sass",
          scss: "Sass",
          css3: "CSS",
          html5: "HTML",
          java: "Java",
          kotlin: "Kotlin",
          swift: "Swift",
          flutter: "Flutter",
          dart: "Dart",
          webpack: "Webpack",
          vite: "Vite",
          rollup: "Rollup",
          electron: "Electron",
          unity: "Unity",
          git: "Git",
          github: "GitHub",
          api: "REST API",
          graphql: "GraphQL",
          sqlite: "SQLite",
          redis: "Redis",
          laravel: "Laravel",
          symfony: "Symfony",
          django: "Django",
          flask: "Flask",
          fastapi: "FastAPI",
          lua: "Lua",
          csharp: "C#",
          cplusplus: "C++",
          cpp: "C++",
        };

        if (techMapping[topicLower]) {
          technologies.add(techMapping[topicLower]);
        }
      });
    });

    // Agregar tecnologías implícitas basadas en los lenguajes encontrados
    if (technologies.has("JavaScript")) {
      technologies.add("HTML");
      technologies.add("CSS");
      technologies.add("Node.js");
    }
    if (technologies.has("TypeScript")) {
      technologies.add("HTML");
      technologies.add("CSS");
      technologies.add("Node.js");
    }
    if (technologies.has("PHP")) {
      technologies.add("HTML");
      technologies.add("CSS");
    }

    // Calcular estrellas y forks totales de repositorios obtenidos (muestra representativa)
    const totalStars = realRepos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );
    const totalForks = realRepos.reduce(
      (sum, repo) => sum + repo.forks_count,
      0
    );

    const result = {
      yearsOfExperience,
      totalProjects, // Usar el número real de repos públicos del usuario
      technologiesUsed: Array.from(technologies).slice(0, 20), // Mostrar hasta 20 tecnologías
      totalStars,
      totalForks,
    };

    // Guardar en caché - solo en el cliente
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: result,
          timestamp: Date.now(),
        })
      );
    }

    return result;
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    // Fallback con estadísticas básicas
    return {
      yearsOfExperience: 4,
      totalProjects: 5,
      technologiesUsed: ["JavaScript", "TypeScript", "Astro", "React"],
      totalStars: 10,
      totalForks: 2,
    };
  }
}
