export type DEEZER_SEARCH_DATA = {
  id: string | number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: string | number;
  rank: string | number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  artist: {
    id: string | number;
    name: string;
    link: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    tracklist: string;
    type: string;
  };
  album: {
    id: string | number;
    title: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
    tracklist: string;
    type: string;
  };
  type: string;
};

export type DEEZER_SEARCH_RESPONSE = {
  data: DEEZER_SEARCH_DATA[];
  total: number;
  next: string | null;
};

export type DEEZER_ALBUM_DATA = {
  id: number;
  title: string;
  upc: string;
  link: string;
  share: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  genre_id: number;
  genres: {
    data: {
      id: number;
      name: string;
      picture: string;
      type: string;
    }[];
  };
  label: string;
  nb_tracks: number;
  duration: number;
  fans: number;
  release_date: string;
  record_type: string;
  available: boolean;
  tracklist: string;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  contributors: {
    id: number;
    name: string;
    link: string;
    share: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    radio: boolean;
    tracklist: string;
    type: string;
    role?: string;
  }[];
  artist: {
    id: number;
    name: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    tracklist: string;
    type: string;
  };
  type: string;
  tracks: {
    data: {
      id: number;
      readable: boolean;
      title: string;
      title_short: string;
      title_version: string;
      link: string;
      duration: number;
      rank: number;
      explicit_lyrics: boolean;
      explicit_content_lyrics: number;
      explicit_content_cover: number;
      preview: string;
      md5_image: string;
      artist: {
        id: number;
        name: string;
        tracklist: string;
        type: string;
      };
      album: {
        id: number;
        title: string;
        cover: string;
        cover_small: string;
        cover_medium: string;
        cover_big: string;
        cover_xl: string;
        md5_image: string;
        tracklist: string;
        type: string;
      };
      type: string;
    }[];
  };
};

export type DEEZER_TRACK_DATA = {
  id: number;
  readable: boolean;
  release_date: string;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  artist: {
    id: number;
    name: string;
    tracklist: string;
    type: string;
  };
  album: {
    id: number;
    title: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
    md5_image: string;
    tracklist: string;
    type: string;
  };
  type: string;
  contributors: {
    id: number;
    name: string;
    link: string;
    share: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    radio: boolean;
    tracklist: string;
    type: string;
    role: string;
  }[];
  track_token: string;
};
