export interface Theme {
  name: string;
  primary: string;
  accent: string;
  body: string;
  details: string;
}

const themes: Theme[] = [
  {
    name: "default",
    primary: "#fed7d7",
    accent: "#b98527",
    body: "#f0f0f0",
    details: "#56443c",
  },
  {
    name: "dark",
    primary: "#453a49",
    accent: "#ce5c0c",
    body: "#191d32",
    details: "#282f44",
  },

  {
    name: "nature",
    primary: "#a1c181",
    accent: "#fcca46",
    body: "#233d4d",
    details: "#fe7f2d",
  },
  {
    name: "soil",
    primary: "#720026",
    accent: "#ff7f51",
    body: "#4f000b",
    details: "#ce4257",
  },
  {
    name: "ocean",
    primary: "#219ebc",
    accent: "#ffb703",
    body: "#8ecae6",
    details: "#023047",
  },
  {
    name: "night",
    primary: "#1b2a41",
    accent: "#6e44ff",
    body: "#324a5f",
    details: "#b892ff",
  },
];

export default themes;
