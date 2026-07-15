async function parseTextDatabase() {
    try {
        const response = await fetch('./resume.md');
        const rawText = await response.text();

        const sections = rawText.split(/^#\s+/m);
        const database = {};

        sections.forEach(section => {
            if (!section.trim()) return;
            const lines = section.split('\n');
            const key = lines[0].trim().toLowerCase(); 
            const value = lines.slice(1).join('\n').trim();
            database[key] = value;
        });

        // 2. Inject the data into your planned HTML schema
        if (database.name) document.getElementById('resume-name').textContent = database.name;
        if (database.position) document.getElementById('resume-position').textContent = database.position;
        if (database.summary) document.getElementById('resume-summary').textContent = database.summary;

        // 3. Handle list data (like skills) by splitting the string by commas
        if (database.skills) {
            const skillsList = document.getElementById('resume-skills');
            skillsList.innerHTML = ''; // Clear loading text

            const skillsArray = database.skills.split(',').map(skill => skill.trim());
            skillsArray.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                skillsList.appendChild(li);
            });
        }

        // 4. Parse the Complex Multi-line Experience Block
        if (database.experience) {
            const expContainer = document.getElementById('experience-container');
            expContainer.innerHTML = ''; // Clear loading text

            // Split by the triple hashtag '###' at the start of a line
            const jobBlocks = database.experience.split(/^###\s+/m);

            jobBlocks.forEach(block => {
                if (!block.trim()) return;

                const lines = block.split('\n');
                
                // The first line contains the header text: "Company | Role | Dates"
                const headerInfo = lines[0].split('|').map(item => item.trim());
                const company = headerInfo[0] || '';
                const role = headerInfo[1] || '';
                const dates = headerInfo[2] || '';

                // The remaining lines are the bullet points
                const bulletLines = lines.slice(1)
                    .map(line => line.trim())
                    .filter(line => line.startsWith('*')); // Only grab actual bullet lines

                // 3. Construct the HTML structure for this specific job card
                const jobElement = document.createElement('div');
                jobElement.className = 'job-card';
                
                jobElement.innerHTML = `
                    <div class="job-header">
                        <h4>${role} <span class="company">at ${company}</span></h4>
                        <span class="job-dates">${dates}</span>
                    </div>
                    <ul class="job-bullets">
                        ${bulletLines.map(line => `<li>${line.replace('*', '').trim()}</li>`).join('')}
                    </ul>
                `;

                // Append the constructed card to the page
                expContainer.appendChild(jobElement);
            });
        }

    } catch (error) {
        console.error("Error reading the custom text database:", error);
    }
}

parseTextDatabase();