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
`POST` `/api/auth` body: `email`: string, `password`: string

Registry user
`POST` `/api/users` body: `name`: string, `email`: string, `password`: string

Create the post
`POST` `/api/posts` `post` body: `text`: string, `password`: string<br />
Get all post
`GET` `/api/posts`<br />
Get post by id
`GET` `/api/posts/:id`<br />
Get post by id
`GET` `/api/posts/:id`<br />
DELETE post by id
`DELETE` `/api/posts/:id`<br />

Get current user profile
`GET` `/api/profile/me`<br />
Create or update user profile
`POST` `/api/profile` body: `status`: string, `skills`: string separate with coma<br />
Get all profiles
`GET` `/api/profile`<br />
Get user profile by userId
`POST` `/api/profile` body: `userId`: string<br />
Delete users and profile
`DELETE` `/api/profile`<br />
Add profile experience
`PUT` `/api/experience` body: `title`: string, `company`: string, `from`: string<br />
Delete profile experience
`Delete` `/api/experience` body: `experienceId`: string<br />
Add profile education
`PUT` `api/profile/education`
body:
`school`: string
`fieldofstudy`: string
`from`: string
`degree`: string
Delete profile education from profile
`DELETE` `api/profile/education` body: `educationId`: string
Get github repos by username
`GET` `/github/:username` params: `perPage`: per page elements, `sortBy`: sorting by field, `sort`: 1 asc 0 desc

---
