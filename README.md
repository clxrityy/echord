# 乇chord <img src="./public/apple-touch-icon.png" width="32px" />

A music cataloging, rating, reviewing, and recommendation web app.

# Roadmap

## TO-DO

- [ ] Ratings
- [ ] Reviews
- [x] `/` - Home (Feed)
  - [ ] `/feed/[id]` - Specific feed item
  - [ ] Pagination
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
- [ ] Refactor a new layout component that uses client capabilities to adjust the layout based on the screen size
- [x] Refactor the feed component to use a grid layout for the home page

#### Fixes (12-04-2025)
- [x] Fix the feed to overflow & fit on every screen size (main page)

##### Features
- [x] Add a search bar to the home page
- [x] Feed display
  - [ ] Show the most recent activity from users you follow
  - [x] Show the most recent activity from all users
  - [ ] Show the most recent activity from your own profile
- [ ] Open feed items in a modal
- [x] Ability to remove your own feed items
- [ ] Remove your own favorited/saved songs

### FUTURE / IDEAS

- [ ] Add the ability to feature user playlists on profiles, interact with them, and add them to the feed.
- [ ] Add the ability to add a rating to a review
- [ ] (optional for users) Enable showing your currently playing song on your profile.
- [ ] Adjust feed to show the most recent activity from users you follow.
- [ ] Randomly recommend other user's feed based on your interactions
<br />
- [ ~ ] Make it so the average rating is shown by color gradient ranking system for albums and/or tracks
