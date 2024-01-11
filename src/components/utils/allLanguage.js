const allCountries = [
  ["English", "gb", "44"],
  ["French", "fr", "33"],
  ["Spain", "es", "34"],
];


export default allCountries.map(([name, iso2, dialCode]) => ({
  name,
  iso2: iso2.toUpperCase(),
  dialCode
}));
