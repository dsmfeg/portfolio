// Navigation element
let pages = [
    { url: 'index.html', title: 'Home' },
    { url: 'projects/index.html', title: 'Projects' },
    { url: 'Resume/index.html', title: 'Resume' },
    { url: 'contact/index.html', title: 'Contact Me' },
    { url: 'meta/index.html', title: 'Meta' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"
    : "/portfolio/";

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    nav.append(a);
}

// Light and Dark Mode Selection
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="light dark">Automatic</option>
    </select>
  </label>`,
);

let select = document.querySelector('.color-scheme select');

if ('colorScheme' in localStorage) {
  const saved = localStorage.colorScheme;
  document.documentElement.style.setProperty('color-scheme', saved);
  select.value = saved;
}

select.addEventListener('input', function (event) {
  const value = event.target.value;
  document.documentElement.style.setProperty('color-scheme', value);
  localStorage.colorScheme = value;
});

// Fetch JSON utility
export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

// Render projects — supports optional url field on each project
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  projects.forEach(project => {
    const article = document.createElement('article');
    const heading = document.createElement(headingLevel);

    if (project.url) {
      const link = document.createElement('a');
      link.href = project.url;
      link.target = '_blank';
      link.textContent = project.title;
      heading.appendChild(link);
    } else {
      heading.textContent = project.title;
    }

    article.innerHTML = `
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description || ''}</p>
      <p class="project-year">${project.year || ''}</p>
    `;
    article.prepend(heading);
    containerElement.appendChild(article);
  });
}

// GitHub API
export async function fetchGithubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
