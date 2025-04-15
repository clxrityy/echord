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
