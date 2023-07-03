const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('change', () => {
  nav.style.display = menuToggle.checked ? 'flex' : 'none';
  adjustPadding();
});

window.addEventListener('load', adjustPadding);
window.addEventListener('resize', adjustPadding);

function adjustPadding() {
  const headerHeight = document.querySelector('header').offsetHeight;
  document.querySelector('.content').style.paddingTop = headerHeight + 'px';
}