// Helper function to turn basic markdown **bolding** into <strong> HTML elements
function formatMarkdown(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

async function loadDigitalCV() {
    try {
        const response = await fetch('./resume.md');
        const rawText = await response.text();

        const sections = rawText.split(/^#\s+/m);
        const db = {};

        sections.forEach(section => {
            if (!section.trim()) return;
            const lines = section.split('\n');
            const key = lines[0].trim().toLowerCase();
            const value = lines.slice(1).join('\n').trim();
            db[key] = value;
        });

        // 1. Name & Title
        if (db.name) document.getElementById('resume-name').textContent = db.name;
        if (db.title) document.getElementById('resume-title').textContent = db.title;

        // 2. Contact Info (Parses Name | Href Link)
        if (db.contact) {
            const container = document.getElementById('resume-contact');
            container.innerHTML = db.contact.split('\n')
                .filter(l => l.trim().startsWith('*'))
                .map(l => {
                    const parts = l.replace('*', '').split('|').map(p => p.trim());
                    return `<li><a href="${parts[1] || '#'}">${parts[0]}</a></li>`;
                }).join('');
        }

        // 3. Summary
        if (db.summary) document.getElementById('resume-summary').innerHTML = formatMarkdown(db.summary);

        // 4. Experience Section
        if (db.experience) {
            const container = document.getElementById('experience-container');
            container.innerHTML = db.experience.split(/^###\s+/m)
                .filter(b => b.trim())
                .map(block => {
                    const lines = block.split('\n');
                    const header = lines[0].split('|').map(h => h.trim());
                    const company = header[0] || '';
                    const role = header[1] || '';
                    const dates = header[2] || '';
                    
                    const bullets = lines.slice(1)
                        .filter(l => l.trim().startsWith('*'))
                        .map(l => `<li>${formatMarkdown(l.replace('*', '').trim())}</li>`)
                        .join('');

                    return `
                        <article>
                          <header>
                            <h3><strong>${company}</strong> | ${role}</h3>
                            <p><em>${dates}</em></p>
                          </header>
                          <ul>${bullets}</ul>
                        </article>
                    `;
                }).join('');
        }

        // 5. Projects Section (Handles inline links and bold descriptions)
        if (db.interest) {
            const container = document.getElementById('interest-container');
            container.innerHTML = db.interest.split('\n')
                .filter(l => l.trim().startsWith('*'))
                .map(l => {
                    const parts = l.replace('*', '').split('|').map(p => p.trim());
                    const mainContent = formatMarkdown(parts[0]);
                    const linkMarkup = parts[1] ? ` <a href="${parts[1]}">link</a>` : '';
                    return `<li>${mainContent}${linkMarkup}</li>`;
                }).join('');
        }

        // 6. Education Section
        if (db.education) {
            const container = document.getElementById('education-container');
            container.innerHTML = db.education.split(/^###\s+/m)
                .filter(b => b.trim())
                .map(block => {
                    const header = block.split('\n')[0].split('|').map(h => h.trim());
                    return `
                        <article>
                          <header>
                            <h3><strong>${header[0] || ''}</strong> | ${header[1] || ''}</h3>
                            <p><em>${header[2] || ''}</em> | <strong>${header[3] || ''}</strong></p>
                          </header>
                        </article>
                    `;
                }).join('');
        }

        // 7. Technical Skills Section
        if (db.skills) {
            const container = document.getElementById('skills-container');
            container.innerHTML = db.skills.split('\n')
                .filter(l => l.trim().startsWith('*'))
                .map(l => `<li>${formatMarkdown(l.replace('*', '').trim())}</li>`)
                .join('');
        }

    } catch (err) {
        console.error("Failed to render dynamic resume layout:", err);
    }
}

loadDigitalCV();