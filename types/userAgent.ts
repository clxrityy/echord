export type UserAgent = {
  isBot: boolean;
  browser: {
    name: string | undefined;
    version: string | undefined;
    major: string;
  };
  device: {
    type: "console" | "mobile" | "tablet" | "desktop" | "smarttv" | "wearable" | "embedded" | undefined;
    vendor: string;
    model: string | undefined;
  };
  os: {
    name: "Amaya" | "Blink" | "EdgeHTML" | "Flow" | "Gecko" | "Goanna" | "iCab" | "KHTML" | "Links" | "NetFront" | "NetSurf" | "Presto" | "Tasman" | "Trident" | "w3m" | "Webkit" | undefined;
    version: string;
  };
  cpu: {
    architecture: "68k" | "amd64" | "arm" | "arm64" | "armhf" | "avr" | "ia32" | "ia64" | "irix"| "irix64" | "mips" | "mips64" | "pa-risc" | "ppc" | "sparc" | "sparc64" | undefined;
  };
}
