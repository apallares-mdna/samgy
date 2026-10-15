
function toggleMenu() {
  const sidebar = document.getElementById("mySidebar");
  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}
const searchInput = document.querySelector('.search-box input');

if (searchInput) {
  searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query !== '') {
        alert("Buscando: " + query);
      }
    }
  });
}
const courseButtons = document.querySelectorAll('.card-btn');

if (courseButtons.length > 0) {
  courseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const courseName = e.target.textContent;
      alert("Has seleccionado el curso: " + courseName);
    });
  });
}
