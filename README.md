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

Auth user and get token<br />
`POST` `/api/auth` body: `email`: string, `password`: string<br />

Registry user<br />
`POST` `/api/users`<br />
body: `name`: string, `email`: string, `password`: string

Create the post<br />
`POST` `/api/posts` `post` body: `text`: string, `password`: string
Get all post<br />
`GET` `/api/posts`
Get post by id<br />
`GET` `/api/posts/:id`
Get post by id<br />
`GET` `/api/posts/:id`
DELETE post by id<br />
`DELETE` `/api/posts/:id`

Get current user profile<br />
`GET` `/api/profile/me`
Create or update user profile<br />
`POST` `/api/profile`
body: `status`: string, `skills`: string separate with coma
Get all profiles<br />
`GET` `/api/profile`
Get user profile by userId<br />
`POST` `/api/profile` body: `userId`: string
Delete users and profile<br />
`DELETE` `/api/profile`
Add profile experience<br />
`PUT` `/api/experience`
body: `title`: string, `company`: string, `from`: string<br />
Delete profile experience<br />
`Delete` `/api/experience`
body: `experienceId`: string<br />
Add profile education<br />
`PUT` `api/profile/education`<br />
body: `school`: string `fieldofstudy`: string `from`: string `degree`: string
Delete profile education from profile<br />
`DELETE` `api/profile/education` body: `educationId`: string
Get github repos by username<br />
`GET` `/github/:username` params: `perPage`: per page elements, `sortBy`: sorting by field, `sort`: 1 asc 0 desc

---
