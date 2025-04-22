# 乇chord <img src="./public/apple-touch-icon.png" width="32px" />

A music cataloging, rating, reviewing, and recommendation web app.

# Roadmap

## TO-DO

- [ ] Ratings !!!
- [ ] Reviews !!!
- [x] `/` - Home (Feed)
      ~~- [ ] `/feed/[id]` - Specific feed item~~
  - [x] Pagination
- [x] `/search/[id]` - Search
  - [x] Search for albums
  - [x] Search for tracks
  - [ ] Search for users
- [ ] Item routes
  - [x] `/album/[id]` - Album
    - [ ] Album details
    - [ ] Album reviews
    - [ ] Album ratings
    - [ ] Album favorites
  - [ ] `/track/[id]` - Track
    - [ ] Track details
    - [ ] Track reviews
    - [ ] Track ratings
    - [ ] Track favorites
- [x] `/profile/[id]` - User profiles
  - [ ] User settings
    - [x] Open settings modal
    - [ ] Change password
    - [ ] Change username
    - [ ] Change avatar
    - [ ] Change bio
  - [ ] User feed
    - [ ] User reviews
    - [ ] User ratings
  - [ ] User profile
    - [x] User favorites
    - [x] User saves (right side column)
    - [ ] User follow button
    - [ ] User followers
    - [ ] User following
  - [ ] Notifications
  - [ ] Connect with Spotify / Apple Music
- [x] `/login` - Sign in
- [x] `/signup` - Sign up
- [x] `/logout` - Sign out

#### 21-04-2025 Auth Refactor [commit](https://github.com/clxrityy/echord/commit/b6afe3ea49b85a9476ac2d76f1a9c4b68015380f)

- [x] Remove `jsonwebtoken` & `cookie` packages
  - [x] Replaced with `jose`
    - [x] Use `SignJWT` to create a JWT token
    - [x] Use `jwtVerify` to verify/decrypt the JWT token
- [x] No longer create a cookie when handling the database session (anytime a page is loaded).
  - [x] Remove the `handleSession()` function from the server actions.
  - [x] Instead, create a JWT token and store it in a cookie upon authentication.
  - [x] Use middleware to update the session.
    - [x] Get the session from the cookie
    - [x] Decrypt the JWT token
    - [x] Update the expiration date of the session

##### Features

- [x] Add a search bar to the home page
- [x] Feed display
  - [ ] Show the most recent activity from users you follow
  - [x] Show the most recent activity from all users
  - [ ] Show your most recent activity on your own profile
- [x] Open feed items in a modal
- [x] Ability to remove your own feed items
- [x] Remove your own favorited/saved songs
- [ ] Click on a liked song (on someone's profile) to open a modal with the track

### FUTURE / IDEAS

- [ ] Add the ability to feature user playlists on profiles, interact with them, and add them to the feed.
- [ ] Add the ability to add a rating to a review
- [ ] (optional for users) Enable showing your currently playing song on your profile.
- [ ] Adjust feed to show the most recent activity from users you follow.
- [ ] Randomly recommend other user's feed based on your interactions

- [ ] Make it so the average rating is shown by color gradient ranking system for albums and/or tracks
- [ ] Ability to customize/move album images from your saves on your profile (react draggable)
