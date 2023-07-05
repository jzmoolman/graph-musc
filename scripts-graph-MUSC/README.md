# Heroku deployment

Run commands in the directory: **graph-musc**

1) `heroku login` login
2) `heroku git:remote  -a beta-gene-musc` (only first time:)
3) `git remote -v` check heroku endpoint name
4) `git remote rename heroku heroku-staging` rename heroku endpoint
5) git push heroku-staging `git subtree split --prefix app-graph-MUSC  master`:master --force
