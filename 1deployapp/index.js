require('dotenv').config() // This line loads environment variables from a .env file into process.env

const express = require('express') // Import the express module
const app = express()
const port = 4000

const githubdata={
  "login": "Setujha90",
  "id": 121721872,
  "node_id": "U_kgDOB0FUEA",
  "avatar_url": "https://avatars.githubusercontent.com/u/121721872?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/Setujha90",
  "html_url": "https://github.com/Setujha90",
  "followers_url": "https://api.github.com/users/Setujha90/followers",
  "following_url": "https://api.github.com/users/Setujha90/following{/other_user}",
  "gists_url": "https://api.github.com/users/Setujha90/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/Setujha90/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/Setujha90/subscriptions",
  "organizations_url": "https://api.github.com/users/Setujha90/orgs",
  "repos_url": "https://api.github.com/users/Setujha90/repos",
  "events_url": "https://api.github.com/users/Setujha90/events{/privacy}",
  "received_events_url": "https://api.github.com/users/Setujha90/received_events",
  "type": "User",
  "user_view_type": "public",
  "site_admin": false,
  "name": "Setu Jha",
  "company": null,
  "blog": "",
  "location": null,
  "email": null,
  "hireable": null,
  "bio": "Engineer",
  "twitter_username": null,
  "public_repos": 10,
  "public_gists": 0,
  "followers": 0,
  "following": 0,
  "created_at": "2022-12-31T13:35:18Z",
  "updated_at": "2025-06-23T13:29:00Z"
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/twitter', (req, res) => {
  res.send('Hello Twitter!')
})

app.get('/login', (req, res) => {
  res.send('Hello Login!')
})

app.get('/github', (req, res) => {
  res.json(githubdata) // Send the GitHub data as JSON response
})

app.get('/youtube', (req, res) => {
  res.send("<h2>Welcome to YouTube</h2>")
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT || port}!`)
})
 