# Roadmap

- [TODO](#to-do)
- [Seamless routing experience](#seamless-routing-experience)
- [Interactivity](#interactivity)
- [Screen accessibility](#screen-accessibility)
- [Features](#features)
- [Utility](#utility)
- [Future / Ideas](#future--ideas)

## TO-DO

- [x] Ratings
  - [x] Rate a track
  - [x] Compile average rating
  - [ ] Rate a review
  - [ ] Display average rating
  - [ ] Update UI to show user rating
- [ ] Reviews !!!
- [x] `/` - Home (Feed)
  - [ ] ~~`/feed/[id]` - Specific feed item~~
    - [x] Replaced with modal
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
  - [x] `/track/[id]` - Track
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
  - [x] User feed
  - [ ] User reviews
  - [ ] User ratings
  - [x] User favorites
    - [x] Favorites box (right side on large screen)
    - [ ] Link to list of favorites
  - [x] User saves
    - [ ] Link to list of saves
  - [ ] User profile
    - [x] User favorites
    - [x] User saves (left side column)
    - [ ] User follow button
    - [ ] User followers
    - [ ] User following
  - [ ] Notifications
  - [ ] Connect with Spotify / Apple Music
- [x] `/login` - Sign in
- [x] `/signup` - Sign up
- [x] `/logout` - Sign out
- [ ] Add pagination to `/search`

#### Seamless routing experience

- [x] Navigation
- [x] Add a loading spinner
- [x] Add proper skeletons and suspense
- [x] Album/track routes
  - [ ] Review modal
  - [ ] Interaction feed
  - [ ] Sidebar with related albums/tracks `*`
- [x] User profile route
  - [x] User box
    - [x] Review count
    - [x] Rating count
    - [x] Favorite count
    - [x] Save count
    - [x] Follower count
    - [x] Following count
  - [ ] User reviews
  - [ ] User ratings
  - [ ] User favorites
    - [x] Begun
  - [x] User saves
    - [ ] Link to list of saves
  - [ ] User followers
  - [ ] User following
  - [ ] User settings
  - [ ] Interaction feed
  - [ ] Sidebar with related users `*`

#### Interactivity

- [x] Save interaction
  - [x] Displays on feed
  - [x] Displays on profile
  - [ ] Displays on album/track
- [x] Favorite interaction
  - [x] Displays on feed
  - [x] Displays on profile
  - [ ] Displays on album/track
- [ ] Review interaction
  - [ ] Displays on feed
  - [ ] Displays on profile
  - [ ] Displays on album/track
- [x] Rate interaction
  - [x] Displays on feed
  - [ ] Displays on profile
  - [ ] Displays on album/track

#### Screen accessibility

- [x] Large screen
  - [x] Desktop
  - [x] Tablet
- [ ] Small screen

##### Features

- [x] Add a search bar to the home page
- [x] Feed display
  - [ ] Show the most recent activity from users you follow
  - [x] Show the most recent activity from all users
  - [ ] Show your most recent activity on your own profile
- [x] Open feed items in a modal
  - [ ] Modal should show interaction details
- [x] Ability to remove your own feed items
- [x] Remove your own favorited/saved songs
- [x] Click on a liked song (on someone's profile) to open a modal with the track
  - [ ] Modal should show the album cover, track name, artist name, etc.
- [ ] Public API

#### Utility

- [x] Terms of Service
- [x] Privacy Policy
- [ ] Contact Us
- [ ] About Us

### FUTURE / IDEAS

- [ ] Add the ability to feature user playlists on profiles, interact with them, and add them to the feed.
- [ ] Add the ability to add a rating to a review
- [ ] (optional for users) Enable showing your currently playing song on your profile.
- [ ] Adjust feed to show the most recent activity from users you follow.
- [ ] Randomly recommend other user's feed based on your interactions

- [ ] Make it so the average rating is shown by color gradient ranking system for albums and/or tracks
- [ ] Ability to customize/move album images from your saves on your profile (react draggable)

- [ ] Allow interactive listening sessions/parties integrated with Spotify/Apple Music

  - [ ] Host a listening party
    - [ ] Title
    - [ ] Description
    - [ ] Image (?)
    - [ ] Tracklist / playlist / album
    - [ ] Invite friends
  - [ ] Join a listening party
    - [ ] Chat
    - [ ] Reactions
    - [ ] Live updates
  - [ ] Leave a listening party

- [ ] Extend the API to allow for searching for music in places like SoundCloud, etc.
