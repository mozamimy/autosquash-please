const saveOptions = (e) => {
    e.preventDefault();

    let validationErrors = [];
    const githubToken = document.getElementById('github-token').value.trim();
    const gheDomain = document.getElementById('ghe-domain').value.trim();
    const gheToken = document.getElementById('ghe-token').value.trim();

    if (githubToken === '') {
        validationErrors.push({
            Key: 'github_token',
            Message: 'GitHubToken should not be empty.',
        });
    }

    if (gheDomain !== '' && gheToken === '') {
        validationErrors.push({
            Key: 'ghe_token',
            Message: 'GHEToken should not be empty.',
        });
    }

    if (validationErrors.length == 0) {
        browser.storage.local.set({
            github_token: document.getElementById('github-token').value.trim(),
            ghe_domain: document.getElementById('ghe-domain').value.trim(),
            ghe_token: document.getElementById('ghe-token').value.trim(),
        }).then(() => {
            alert('Options are saved.');
        }).catch((e) => {
            alert('An error occured in saving options.');
            console.error(e);
        });
    } else {
        let errorMessage = 'Validation error!\n';
        validationErrors.forEach((error) => {
            errorMessage += `${error.Key}: ${error.Message}\n`;
        });
        alert(errorMessage);
    }
};

const restoreOptions = () => {
    Promise.all([
        browser.storage.local.get('github_token'),
        browser.storage.local.get('ghe_domain'),
        browser.storage.local.get('ghe_token'),
    ]).then((results) => {
        document.getElementById('github-token').value = results[0].github_token || '';
        document.getElementById('ghe-domain').value = results[1].ghe_domain || '';
        document.getElementById('ghe-token').value = results[2].ghe_token || '';
    }).catch((e) => {
        console.error('An error occured in loading options.');
        console.error(e);
    });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
