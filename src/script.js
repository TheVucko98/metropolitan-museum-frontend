fetch("components/navbar.html")
    .then(response => response.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
        loadDepartments();
        setupSearch();
    })
    .catch(err => console.error("Greška pri učitavanju navbar-a:", err));

function loadDepartments() {
    fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments")
        .then(res => res.json())
        .then(data => {
            const menu = document.getElementById("departmentsMenu");
            data.departments.forEach(dep => {
                const li = document.createElement("li");
                li.innerHTML = `<a class="dropdown-item" href="department.html?depId=${dep.departmentId}">${dep.displayName}</a>`;
                menu.appendChild(li);
            });
        })
        .catch(err => console.error("Greška pri učitavanju departments:", err));
}

function setupSearch() {
    const form = document.getElementById("searchForm");
    form.addEventListener("submit", e => {
        e.preventDefault();
        const query = document.getElementById("searchInput").value.trim();
        if (query) {
            window.location.href = `search.html?query=${encodeURIComponent(query)}`;
        }
    });
}
