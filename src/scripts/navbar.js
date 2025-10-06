export function loadNavbar(){
    fetch("components/navbar.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("navbar").innerHTML = html;
            loadDepartments();
            setupSearch();
        })
        .catch(err => console.error("Error loading navbar :", err));

    function loadDepartments() {
        fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments")
            .then(res => res.json())
            .then(data => {
                const menu = document.getElementById("departmentsMenu");
                data.departments.forEach(dep => {
                    const li = document.createElement("li");
                    li.innerHTML = `<a class="dropdown-item btn "  
                        onclick="loadDepartment(${dep.departmentId})">${dep.displayName}</a>`;

                    menu.appendChild(li);
                });
            })
            .catch(err => console.error("Error loading departments:", err));
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
}

export function goToAbout(){
    fetch("../components/about.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("pageContent").innerHTML = html;
        })
        .catch(err => console.error("Error loading home:", err));
}
export function goToHome(){
    fetch("components/home.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("pageContent").innerHTML = html;
        })
        .catch(err => console.error("Error loading home:", err));
}


