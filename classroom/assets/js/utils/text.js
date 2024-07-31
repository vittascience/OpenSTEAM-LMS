function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function truncateTextByLength(text, length) {
  if (typeof text !== "string") {
    return false;
  }
  return text.length > length ? text.substring(0, length) + "..." : text;
}

function textToLowerCase(text) {
  if (typeof text !== "string") {
    return false;
  }
  return text.toLocaleLowerCase();
}
