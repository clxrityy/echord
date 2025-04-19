# 乇chord <img src="./public/apple-touch-icon.png" width="32px" />

A music cataloging, rating, reviewing, and recommendation web app.

# Roadmap

## TO-DO

- [ ] Ratings !!!
- [ ] Reviews !!!
- [x] `/` - Home (Feed)
  - [ ] `/feed/[id]` - Specific feed item
  - [x] Pagination
- [x] `/search/[id]` - Search
  - [ ] Pagination
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
- [ ] `/logout` - Sign out

##### Refactor structure and stacking of components (07-04-2025)

- [x] Move feed display only to the home page
- [x] Refactor a new layout component that uses client capabilities to adjust the layout based on the screen size
  - [x] ~~Kind of done, doesn't work on mobile yet~~
- [x] Refactor the feed component to use a grid layout for the home page

#### fixes

- [x] Fix feed display (server) within `<Window />` (client) **Hydration Error**
  - [x] ~~**Fix**: Just wrapped the `<Hero />` component within the `<Window />` component. This way the window will still be rendered on the client side, but the feed will be rendered on the server side~~
    - [x] **NOTE:** This was not the actual issue, it was with rendering the database functions within a client component. Fixed by moving the database functions to the server side and passing the data to the client component.

##### Features

- [x] Add a search bar to the home page
- [x] Feed display
  - [ ] Show the most recent activity from users you follow
  - [x] Show the most recent activity from all users
  - [ ] Show your most recent activity on your own profile
- [ ] Open feed items in a modal
- [x] Ability to remove your own feed items
- [x] Remove your own favorited/saved songs
- [ ] Click on a liked song (on someone's profile) to open a modal with the track

### FUTURE / IDEAS

- [ ] Add the ability to feature user playlists on profiles, interact with them, and add them to the feed.
- [ ] Add the ability to add a rating to a review
- [ ] (optional for users) Enable showing your currently playing song on your profile.
- [ ] Adjust feed to show the most recent activity from users you follow.
- [ ] Randomly recommend other user's feed based on your interactions
      <br />
- [ ~ ] Make it so the average rating is shown by color gradient ranking system for albums and/or tracks
