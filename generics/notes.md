### How to kill process on specific port linux

Command is **kill -9 $(lsof -ti:portNumber)**
\nl

here's the command to kill process on port 7007:

pre.code
kill -9 $(lsof -ti:7007)
pre.code


### How to Authenticate to github API

We need to use [this](https://github.com/octokit/auth-app.js/) to authenticate to github (we use octokit/auth-app.js to generate a JWT token,
then exchanges it for an installation token and this installation token we will need for octokit/rest which is [here](https://github.com/octokit/rest.js)
to actually query for workflow data)
 