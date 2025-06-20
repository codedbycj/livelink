const username = 'codedbycj';

async function fetchGitHubData() {
  try {
    const profileRes = await fetch(`https://api.github.com/users/${username}`);
    if (!profileRes.ok) throw new Error('Profile fetch failed');
    const profile = await profileRes.json();

    document.getElementById('avatar').src = profile.avatar_url;
    document.getElementById('username').textContent = profile.login.toUpperCase();
    document.getElementById('bio').textContent = profile.bio || "No bio available";

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    if (!reposRes.ok) throw new Error('Repos fetch failed');
    const repos = await reposRes.json();

    renderRepoList(repos);
    renderSkillsChart(repos);
  } catch (error) {
    console.error(error);
    alert('Failed to load GitHub data. Check console for details.');
  }
}

function renderRepoList(repos) {
  const repoList = document.getElementById('repo-list');
  repoList.innerHTML = '';

  repos.forEach(repo => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a> - ⭐ ${repo.stargazers_count} - Forks: ${repo.forks_count}
      <p>${repo.description || 'No description'}</p>
    `;
    repoList.appendChild(li);
  });
}

function renderSkillsChart(repos) {
  // Count languages
  const langCount = {};
  repos.forEach(repo => {
    const lang = repo.language;
    if (lang) langCount[lang] = (langCount[lang] || 0) + 1;
  });

  const labels = Object.keys(langCount);
  const data = Object.values(langCount);

  const ctx = document.getElementById('skills-chart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        label: 'Repositories by Language',
        data,
        backgroundColor: [
          '#0366d6', '#f1e05a', '#e34c26', '#563d7c', '#6f42c1', '#c6538c', '#1f8dd6'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Initialize app
fetchGitHubData();
