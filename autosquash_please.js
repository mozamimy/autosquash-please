const loadOptions = () => {
    return Promise.all([
        browser.storage.local.get('github_token'),
        browser.storage.local.get('ghe_domain'),
        browser.storage.local.get('ghe_token'),
    ]).then((results) => {
        return {
            GitHubToken: results[0].github_token || '',
            GHEDomain: results[1].ghe_domain || '',
            GHEToken: results[2].ghe_token || '',
        };
    });
};

const buildURL = (repositoryInfo) => {
    return (repositoryInfo.Host == 'api.github.com')
        ? `https://${repositoryInfo.Host}/repos/${repositoryInfo.User}/${repositoryInfo.Repository}/pulls/${repositoryInfo.PullRequestNumber}/commits`
        : `https://${repositoryInfo.Host}/api/v3/repos/${repositoryInfo.User}/${repositoryInfo.Repository}/pulls/${repositoryInfo.PullRequestNumber}/commits`;
};

const extractCommitMessages = (commits) => {
    let messages = [];

    commits.forEach((commit) => {
        messages.push(commit.commit.message);
    });

    return messages;
};

const isFixupCommits = (message) => {
    return message.match('^fixup!');
};

const isGitHubDotCom = () => {
    return location.hostname === 'github.com';
};

const setRequestHeader = (request, options) => {
    if (options.GitHubToken !== '' && isGitHubDotCom()) {
        console.log('GitHub');
        request.setRequestHeader('Authorization', `token ${options.GitHubToken}`);
    } else if (options.GHEToken !== '' && location.hostname === options.GHEDomain) {
        console.log('GHE');
        request.setRequestHeader('Authorization', `token ${options.GHEToken}`);
    } else {
        console.error('[autosquash-please] You should set API token.');
    }
};

loadOptions().then((options) => {
    let match = null;
    if (isGitHubDotCom() || location.hostname === options.GHEDomain) {
        match = location.pathname.match('^/(.+)/(.+)/pull/(.+)$');
    }

    if (match) {
        const host = (isGitHubDotCom())
            ? 'api.github.com'
            : options.GHEDomain;

        const repositoryInfo = {
            Host: host,
            User: match[1],
            Repository: match[2],
            PullRequestNumber: match[3],
        };
        console.log('[autosquash-please] repository info');
        console.log(repositoryInfo);

        const request = new XMLHttpRequest();
        request.open('GET', buildURL(repositoryInfo), true);
        setRequestHeader(request, options);

        request.addEventListener('load', (e) => {
            const commitMessages = extractCommitMessages(JSON.parse(e.target.responseText));
            console.log('[autosquash-please] commit messages');
            console.log(commitMessages);

            if (commitMessages.find(isFixupCommits)) {
                console.log('[autosquash-please] A fixup! commit is found.');
                let mergeDetails = document.getElementById('partial-pull-merging');
                mergeDetails.innerHTML = '<p class="merge-pr-more-commits" style="font-weight: bold; font-size: 150%; color: red;">The autosquash-please addon prevents to push merge button.</p>';

            } else {
                console.log('[autosquash-please] No fixup! commits.');
            }
        });

        request.addEventListener('error', (e) => {
            console.error('[autosquash-please] An error on calling GitHub API.');
            console.error(e);
        });

        request.send();
    }
}).catch((e) => {
    console.error('[autosquash-please] An unhandled error occured.');
    console.error(e);
});
