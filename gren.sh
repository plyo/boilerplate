RES=`OCTOKIT_GITHUB_TOKEN=$GREN_GITHUB_TOKEN prepareTags --repo boilerplate` && gren release --data-source=commits --username=plyo --repo=boilerplate --override --tags=$RES
