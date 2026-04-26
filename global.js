// console.log('IT’S ALIVE!');

// function $$(selector, context = document) {
//   return Array.from(context.querySelectorAll(selector));
// }

// let navLinks = $$("nav a")

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// if (currentLink) {
//   // or if (currentLink !== undefined)
//   currentLink.classList.add('current');
// }

// Navigation element
let pages = [
    { url: 'index.html', title: 'Home' },
    { url: 'projects/index.html', title: 'Projects' },
    { url: 'Resume/index.html', title: 'Resume' },
    { url: 'contact/index.html', title: 'Contact Me' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"                  // Local server
    : "/portfolio/";         // GitHub Pages repo name

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

let select = document.querySelector('.color-scheme select')

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


// Projects JSON
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

// export function renderProjects(project, containerElement) {
//   containerElement.innerHTML = '';
//   const article = document.createElement('article');
//   article.innerHTML = `
//     <h3>${project.title}</h3>
//     <img src="${project.image}" alt="${project.title}">
//     <p>${project.description}</p>
//   `;
//   containerElement.appendChild(article);
// }

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  projects.forEach(project => {
    const article = document.createElement('article');
    const heading = document.createElement(headingLevel);
    heading.textContent = project.title;

    article.innerHTML = `
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    article.prepend(heading);
    containerElement.appendChild(article);
  });
}

//Github API
export async function fetchGithubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}