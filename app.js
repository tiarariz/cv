const sheetLinks = {
    profile: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZT9lNoZyVJuSCbz5mcAXq7uYTg6NtARRI6WgSDVeWd4l396yYeEbdHoqxAmSjaF0IV_guKhXSjCur/pub?gid=0&single=true&output=csv',
    experience: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZT9lNoZyVJuSCbz5mcAXq7uYTg6NtARRI6WgSDVeWd4l396yYeEbdHoqxAmSjaF0IV_guKhXSjCur/pub?gid=1314999237&single=true&output=csv',
    interest: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZT9lNoZyVJuSCbz5mcAXq7uYTg6NtARRI6WgSDVeWd4l396yYeEbdHoqxAmSjaF0IV_guKhXSjCur/pub?gid=1478379617&single=true&output=csv',
    education: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZT9lNoZyVJuSCbz5mcAXq7uYTg6NtARRI6WgSDVeWd4l396yYeEbdHoqxAmSjaF0IV_guKhXSjCur/pub?gid=834395103&single=true&output=csv',
    skills: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZT9lNoZyVJuSCbz5mcAXq7uYTg6NtARRI6WgSDVeWd4l396yYeEbdHoqxAmSjaF0IV_guKhXSjCur/pub?gid=1587626964&single=true&output=csv'
};

// Helper to fetch and parse CSV
const fetchSheet = (url) => new Promise(resolve => {
    Papa.parse(url, { download: true, header: true, complete: results => resolve(results.data) });
});

async function renderCV() {
    // Fetch all sheets simultaneously 
    const [profileData, expData, intData, eduData, skillsData] = await Promise.all([
        fetchSheet(sheetLinks.profile),
        fetchSheet(sheetLinks.experience),
        fetchSheet(sheetLinks.interest),
        fetchSheet(sheetLinks.education),
        fetchSheet(sheetLinks.skills)
    ]);

    // 1. Render Profile
    const p = profileData[0];
    document.getElementById('resume-name').textContent = p.name;
    document.getElementById('resume-title').textContent = p.roles;
    document.getElementById('resume-contact').innerHTML = `
    <li>${p.location}</li>
    <li><a href="mailto:${p.email}">${p.email}</a></li>
    <li><a href="${p.linkedin}">@linkedin</a></li>
  `;

    // 2. Render Experience
    document.getElementById('experience-container').innerHTML = expData.map(job => `
    <article>
      <header>
        <h3><strong>${job.company}</strong> | ${job.role}</h3>
        <p><em>${job.dates}</em></p>
      </header>
      <ul>
        ${job.bullets.split('|').map(bullet => `<li>${bullet.trim()}</li>`).join('')}
      </ul>
    </article>
  `).join('');

    // 3. Render Interests
    document.getElementById('interest-container').innerHTML = intData.map(interest => `
    <li><strong>${interest.title}:</strong> ${interest.description}</li>
  `).join('');

    // 4. Render Education
    document.getElementById('education-container').innerHTML = eduData.map(edu => `
    <article>
      <header>
        <h3><strong>${edu.institution}</strong> | ${edu.degree}</h3>
        <p><em>${edu.dates}</em> | <strong>${edu.gpa}</strong></p>
      </header>
    </article>
  `).join('');

    // 5. Render Skills
    document.getElementById('skills-container').innerHTML = skillsData.map(skill => `
    <li><strong>${skill.category}:</strong> ${skill.details}</li>
  `).join('');
}

// Initialize
renderCV();