(function() {
  const storedTheme = localStorage.getItem("pref-theme");
  if (storedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (storedTheme === "light") {
    document.documentElement.classList.remove("dark");
  }
})();
