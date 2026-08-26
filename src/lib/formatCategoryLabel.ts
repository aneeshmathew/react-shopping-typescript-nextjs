// Turns a category slug like "home-decoration" into "Home Decoration" for
// display, while the slug itself keeps being used for filtering/URLs.
export function formatCategoryLabel(slug?: string): string {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
