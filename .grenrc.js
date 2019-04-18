/**
 * @fileOverview The file contains dynamic instructions for glen to generate relase notes.
 * @see https://github-tools.github.io/github-release-notes/
 * @example
 *
 * Run `yarn gren` to generate release notes for latest release. Warning: it will replace your own description!
 */

// we need this map because gren trying to use user's name if it's set, else it uses nickname. For
// better references we need to use nicknames always
const authorsToNicknames = {
  'Andrew Balakirev': 'jifeon',
  'Lukman Nuriakhmetov': 'lookmanrays',
  vladimir: 'VlVl',
  'Vladimir Kutepov': 'frenzzy',
  'Aksel G. Gresvig': 'AGresvig',
  'Roman Zagumennov': 'wanchopen',
  'Alexey Zaitsev': 'FarLauren',
  'Chinara Aytkulova': 'achinara',
  'Alexandr Antonov': 'ahtohbi4',
};

module.exports = {
  dataSource: 'commits',
  template: {
    commit({ message, author, sha }) {
      const isDb = message.match('plyo.db');
      let result =
        '- ' +
        message
          // for commits which update db submodule we re-format a link to PR
          // https://github.com/plyo/plyo.db/pull/852 -> [plyo/plyo.db#852](https://github.com/plyo/plyo.db/pull/852)
          .replace(
            /(plyo\/plyo.db)(\/pull\/|#)?(\d+)/,
            (...$) => `([${$[1]}#${$[3]}](https://github.com/${$[0]}))`,
          )
          // generating link to Jira
          .replace(/PL-\d+/, ($0) => `[${$0}](https://plyolabs.atlassian.net/browse/${$0})`);

      // For db PR we do not know the author
      if (!isDb) {
        result += ` by @${authorsToNicknames[author] || author}`;
      }

      return result + ' ' + sha;
    },
  },
};
