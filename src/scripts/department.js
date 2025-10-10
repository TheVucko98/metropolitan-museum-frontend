export function loadDepartment(depId) {
    fetch(`./components/department.html`)
        .then(res => res.text())
        .then(html => {
            document.getElementById("pageContent").innerHTML = html;
            loadDepartmentData(depId, 1); // počinjemo od prve stranice
        })
        .catch(err => console.error("Error loading department page:", err));
}

let cachedObjectsByDepartment = {}; // Map for every dep we will save "sorted array of ids of object IDs"
let cachedDepartmentNameById = {}
import {itemsPerPage} from "./cachedDataForFetches.js";


function loadDepartmentData(depId, page) {
    let dep;
    if(cachedDepartmentNameById[depId]) {
        dep = cachedDepartmentNameById[depId];
        document.getElementById("depName").textContent = dep.displayName;
    }else{
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/departments`)
            .then(res => res.json())
            .then(data => {
                dep = data.departments.find(d => d.departmentId === depId);
                cachedDepartmentNameById[depId] = dep;
                document.getElementById("depName").textContent = dep.displayName;
            });
    }


    //

    // ako već imamo fetch-ovane i sortirane objekte, koristimo ih
    if (cachedObjectsByDepartment[depId]) {
        renderObjectsPage(cachedObjectsByDepartment[depId], page, itemsPerPage);
    } else {
        // fetch svih objekata u departmanu
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${depId}`)
            .then(res => res.json())
            .then(data => {
                let allObjects = data.objectIDs || [];
                allObjects.sort((a, b) => a - b); // sortiramo po ID rastuće
                cachedObjectsByDepartment[depId] = allObjects; // čuvamo u cache
                renderObjectsPage(allObjects, page, itemsPerPage);
            });
    }
}

import { fetchObjectDataUsingID} from "./cachedDataForFetches.js";

function renderObjectsPage(allObjects, page, itemsPerPage) {
    const totalObjects = allObjects.length;
    const totalPages = Math.ceil(totalObjects / itemsPerPage);
    const offset = (page - 1) * itemsPerPage;
    const container = document.getElementById("departmentContent");
    const pagination = document.getElementById("pagination");


    /////
    const objectsToShow = allObjects.slice(offset, offset + itemsPerPage);
    container.innerHTML = "";

    // pravimo row za 5 colona u redu
    let rows = [];

// prvo napravimo sve potrebne row-ove za ovu stranicu
    const totalRows = Math.ceil(objectsToShow.length / 5);
    for (let i = 0; i < totalRows; i++) {
        const row = document.createElement("div");
        row.className = "row mb-4";
        container.appendChild(row);
        rows.push(row); // dodajemo u niz da bismo kasnije mogli da pristupimo
        // Dodaj praznu colonu size 1
        const col = document.createElement("div");
        col.className = "col-md-1";
        row.appendChild(col);

    }

// sada dodajemo kolone
    objectsToShow.forEach((objId, index) => {
        const rowIndex = Math.floor(index / 5); // koji red za ovaj index
        const row = rows[rowIndex];

        const col = document.createElement("div");
        col.className = "col-md-2 text-center"; // 5 po redu
        // Dolaze konkurentno pa objekti na stranici mogu ici razlicitim redom u zavisnosti koji 1. dodje
        // ali za stranicu npr 7 uvek istih "n" objekata, samo nisu isto uvek sortirani
        fetchObjectDataUsingID(objId)
            .then(objData => {
                const img = document.createElement("img");
                img.src = objData.primaryImageSmall || "../assets/noImage.png";
                img.className = "img-fluid";
                img.alt = objData.title || "No Title";

                const title = document.createElement("a");
                title.href = "#";
                title.textContent = objData.title || "No Title";
                title.className = "d-block mt-2";
                title.onclick = (e) => {

                    loadObjectDetail(objId);

                };

                const objid = document.createElement("h4");
                objid.textContent = objId; // ili innerHTML ako treba HTML

                col.appendChild(img);
                col.appendChild(objid);
                col.appendChild(title);
                row.appendChild(col); // append u pravi row
            })
            .catch(err => console.error(err));
    });

    /////




    pagination.innerHTML = "";

    // Helper za kreiranje linka
    function createPageLi(pageNumber, text = pageNumber, isActive = false, isDisabled = false) {
        const li = document.createElement("li");
        li.className = "page-item" + (isActive ? " active" : "") + (isDisabled ? " disabled" : "");
        const a = document.createElement(isActive ? "span" : "a");
        a.className = "page-link";
        a.href = "#";
        a.textContent = text;
        if (!isActive && !isDisabled) {
            a.addEventListener("click", e => {
                e.preventDefault();
                renderObjectsPage(allObjects, pageNumber, itemsPerPage);
            });
        }
        li.appendChild(a);
        return li;
    }

    // PREV dugme
    pagination.appendChild(createPageLi(page - 1, "Prev", false, page === 1));

    // Prva stranica
    if (page > 2) {
        pagination.appendChild(createPageLi(1));
        if (page > 3) {
            const dots = document.createElement("li");
            dots.className = "page-item disabled";
            const span = document.createElement("span");
            span.className = "page-link";
            span.textContent = "...";
            dots.appendChild(span);
            pagination.appendChild(dots);
        }
    }

    // Trenutni -1
    if (page > 1) pagination.appendChild(createPageLi(page - 1));

    // Trenutna
    pagination.appendChild(createPageLi(page, page, true));

    // Trenutni +1
    if (page < totalPages) pagination.appendChild(createPageLi(page + 1));

    // Poslednja stranica
    if (page < totalPages - 1) {
        if (page < totalPages - 2) {
            const dots = document.createElement("li");
            dots.className = "page-item disabled";
            const span = document.createElement("span");
            span.className = "page-link";
            span.textContent = "...";
            dots.appendChild(span);
            pagination.appendChild(dots);
        }
        pagination.appendChild(createPageLi(totalPages));
    }

    // NEXT dugme
    pagination.appendChild(createPageLi(page + 1, "Next", false, page === totalPages));
}

