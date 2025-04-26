import {
  EAlbum,
  EInteraction,
  EInteractionData,
  ESearch,
  ESession,
  ETrack,
  EUser,
} from '@/prisma/app/generated/prisma/client';

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

export type UserAgent = {
  isBot: boolean;
  browser: {
    name: string | undefined;
    version: string | undefined;
    major: string;
  };
  device: {
    type:
      | 'console'
      | 'mobile'
      | 'tablet'
      | 'desktop'
      | 'smarttv'
      | 'wearable'
      | 'embedded'
      | undefined;
    vendor: string;
    model: string | undefined;
  };
  os: {
    name:
      | 'Amaya'
      | 'Blink'
      | 'EdgeHTML'
      | 'Flow'
      | 'Gecko'
      | 'Goanna'
      | 'iCab'
      | 'KHTML'
      | 'Links'
      | 'NetFront'
      | 'NetSurf'
      | 'Presto'
      | 'Tasman'
      | 'Trident'
      | 'w3m'
      | 'Webkit'
      | undefined;
    version: string;
  };
  cpu: {
    architecture:
      | '68k'
      | 'amd64'
      | 'arm'
      | 'arm64'
      | 'armhf'
      | 'avr'
      | 'ia32'
      | 'ia64'
      | 'irix'
      | 'irix64'
      | 'mips'
      | 'mips64'
      | 'pa-risc'
      | 'ppc'
      | 'sparc'
      | 'sparc64'
      | undefined;
  };
};

export type Interaction =
  | ((EInteraction | null) & {
      eAlbum: EAlbum | null;
      eTrack: ETrack | null;
      user: EUser;
      interactionData: EInteractionData | null;
    })
  | null;

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

export type User = EUser & {
  interactions: EInteraction[];
  session: ESession | null;
  searches: ESearch[];
}