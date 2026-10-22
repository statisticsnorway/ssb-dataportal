export const scrollToFilterTags = () => {
  const filterTagsSection =
    document.getElementById('filter-tags-section') ?? document.getElementById('filter-tags-sidebar-section');
  filterTagsSection?.scrollIntoView?.({ behavior: 'instant', block: 'start' });
};
