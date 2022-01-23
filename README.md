## Install

```shell
git clone https://github.com/Pashafd/ForumDev
cd ForumDev
npm install
```

Scripts

```shell
npm run dev #run server, by default 5500 port
```

## API

Auth user and get token
`POST` `/api/auth`<br />
body: `email`: string, `password`: string

Registry user
`POST` `/api/users`<br />
body: `name`: string, `email`: string, `password`: string

Create the post
`POST` `/api/posts` `post`<br />
body: `text`: string, `password`: string<br />
Get all post
`GET` `/api/posts`<br />
Get post by id
`GET` `/api/posts/:id`<br />
Get post by id
`GET` `/api/posts/:id`<br />
DELETE post by id
`DELETE` `/api/posts/:id`<br />

Get current user profile<br />
`GET` `/api/profile/me`<br />
Create or update user profile<br />
`POST` `/api/profile`<br />
body: `status`: string, `skills`: string separate with coma<br />
Get all profiles<br />
`GET` `/api/profile`<br />
Get user profile by userId<br />
`POST` `/api/profile` body: `userId`: string<br />
Delete users and profile<br />
`DELETE` `/api/profile`<br />
Add profile experience<br />
`PUT` `/api/experience`<br />
body: `title`: string, `company`: string, `from`: string<br />
Delete profile experience<br />
`Delete` `/api/experience`<br />
body: `experienceId`: string<br />
Add profile education<br />
`PUT` `api/profile/education`<br />
body:<br />
`school`: string<br />
`fieldofstudy`: string<br />
`from`: string<br />
`degree`: string<br />
Delete profile education from profile<br />
`DELETE` `api/profile/education`<br />
body: `educationId`: string
Get github repos by username<br />
`GET` `/github/:username`<br />
params: `perPage`: per page elements, `sortBy`: sorting by field, `sort`: 1 asc 0 desc

---
