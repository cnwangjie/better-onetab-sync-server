Better Onetab Sync Server
======

It will provide more features like sharing or management in the future.

## Development notes

### Authorization

Visiting `/auth/:type` will go to OAuth page and the final page will take the jwt token in header.

available type list: **github google** (case-sensitive)

Every time you send a request to API with token will get a new token.

**Tricks for using it in a web extension:**

**1st way** If query string has a paramater named `ext` it will redirect to `${ext}/#${jwt token}#` at the final.

*e.g.*

Visiting

`/auth/github?ext=https%3A%2F%2Fgeghaancpajoplmhcocjboinmihhmpjf.chromiumapp.org%2F%22`

will redirect to

`https://geghaancpajoplmhcocjboinmihhmpjf.chromiumapp.org/#{JWT_TOKEN}#`

at the final.

So it is possible to use `chrome.identity.launchWebAuthFlow` to get token. But it has some incompatibility problem and maybe do not work on Firefox or occur some error in Chrome. So in the new version it will take the next way.

**2nd way** Use content script to send token to background page.

So in the new version of sync server will provide a or more user friendly login page.

### API

**v1**

*all of following API require authorization*

##### GET `/api/info` Get the infos of user and sync.

##### GET `/api/lists` Get all lists.

##### GET `/api/opts` Get all options.

##### PUT `/api/opts` Modify all options.

##### PUT `/api/lists` Modify all lists.

**v2 (planning)**

##### POST `/v2/api/list/:id` Create a new list.

##### PUT `/v2/api/list/:id` Change a list.

##### DELETE `/v2/api/list/:id` Remove a list.

##### PUT `/v2/api/lists/order` Change the order of lists.

##### PUT `/v2/api/opt` Change an option.

##### GET `/v2/api/lists` Get all lists with pagination.

##### PUT `/v2/api/list/:id/public` Make a list public.

