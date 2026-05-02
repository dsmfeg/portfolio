import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// project count
const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `Projects (${projects.length})`;

// lab 05 Pie Chart
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
d3.select('svg').attr('viewBox', '-50 -50 100 100');

let colors = d3.scaleOrdinal(d3.schemeTableau10);
let selectedIndex = -1;

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  // clear up paths and legends
  let svg = d3.select('svg');
  svg.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  // update paths and legends, refer to steps 1.4 and 2.2
  newArcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .on('click', () => {
        // What should we do? (Keep scrolling to find out!)
        selectedIndex = selectedIndex === i ? -1 : i;

        svg
          .selectAll('path')
          .attr('class', (_, idx) => (
            // filter idx to find correct pie slice and apply CSS from above
            idx === selectedIndex ? 'selected' : ''
          ));

        legend
          .selectAll('li')
          .attr('class', (_, idx) => (
            // filter idx to find correct legend and apply CSS from above
            idx === selectedIndex ? 'legend-li selected' : 'legend-li'
          ));

        if (selectedIndex === -1) {
          renderProjects(projects, projectsContainer, 'h2');
        } else {
          // filter projects and render onto webpage
          // Hint: `.label` might be useful
          let filteredProjects = projects.filter((project) => project.year === newData[selectedIndex].label);
          renderProjects(filteredProjects, projectsContainer, 'h2');
        }
      });
  });

  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('class', 'legend-li')
      .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
  });
}

// Call this function on page load
renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
  // update query value
  query = event.target.value;
  // filter projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // render filtered projects
  renderProjects(filteredProjects, projectsContainer, 'h2');
  // re-render legends and pie chart when event triggers
  renderPieChart(filteredProjects);
});