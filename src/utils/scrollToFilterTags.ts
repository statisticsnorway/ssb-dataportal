export const scrollToFilterTags = () => {
  document.getElementById('filter-tags-section')?.scrollIntoView({ behavior: 'instant', block: 'start' });
};
