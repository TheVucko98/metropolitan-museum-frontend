export function getSearchResults(query,page=1,takenFromStack = 0) {
    if(query === "" || !query || query.length > 20) {
        return;
    }
    fetch("../components/search.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("pageContent").innerHTML = html;
            document.getElementById("searchQuery").textContent = "Search query : " + query;
            document.getElementById("searchContent").innerHTML = `<div class="text-center mt-5 " ><h1 class="text-danger">Loading results...</h1></div>`;

            loadSearchData(query,page,takenFromStack);
        })
        .catch(err => console.error("Error loading department page:", err));
}

let cachedObjectsPerSearchQuery = {};
import {itemsPerPage} from "./cachedDataForFetches.js";
function loadSearchData(query,page,takenFromStack = 0) {



    // ako već imamo fetch-ovane i sortirane objekte, koristimo ih
    if (cachedObjectsPerSearchQuery[query]) {
        renderSearchObjectsPage(cachedObjectsPerSearchQuery[query], page, itemsPerPage,query,takenFromStack);
    } else {

        // fetch by title does not work as intended
        //fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}&title=false`)
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`)
            .then(res => res.json())
            .then(data => {
                let allObjects = data.objectIDs || [];

                allObjects.sort((a, b) => a - b); // sortiramo po ID rastuće
                cachedObjectsPerSearchQuery[query] = allObjects; // čuvamo u cache
                renderSearchObjectsPage(allObjects, page, itemsPerPage,query,takenFromStack);
            });
    }
}
import { fetchObjectDataUsingID} from "./cachedDataForFetches.js";

function renderSearchObjectsPage(allObjects, page, itemsPerPage,query,takenFromStack = 0) {
    if(takenFromStack === 0) {
        const stateObj = { pageType: 'search',"query" : query,"pageNumber" : page };
        const url = `/?Search=${query}`;
        history.pushState(stateObj, ``, url);
    }

    const totalObjects = allObjects.length;
    const totalPages = Math.ceil(totalObjects / itemsPerPage);
    const offset = (page - 1) * itemsPerPage;
    const container = document.getElementById("searchContent");
    const pagination = document.getElementById("pagination");

    const objectsToShow = allObjects.slice(offset, offset + itemsPerPage);
    container.innerHTML = "";

    let rows = [];
    const totalRows = Math.ceil(objectsToShow.length / 5);
    for (let i = 0; i < totalRows; i++) {
        const row = document.createElement("div");
        row.className = "row mb-4";
        container.appendChild(row);
        rows.push(row);
        const col = document.createElement("div");
        col.className = "col-md-1";
        row.appendChild(col);
    }

    objectsToShow.forEach((objId, index) => {
        const rowIndex = Math.floor(index / 5);
        const row = rows[rowIndex];
        const col = document.createElement("div");
        col.className = "col-md-2 text-center";

        fetchObjectDataUsingID(objId)
            .then(objData => {
                const img = document.createElement("img");
                img.src = objData.primaryImageSmall || "../assets/noImage.png";
                img.className = "img-fluid";
                img.alt = objData.title || "No Title";

                const title = document.createElement("a");
                title.href = "javascript:void(0)";
                title.textContent = objData.title || "No Title";
                title.className = "d-block mt-2";
                title.onclick = () => loadObjectDetail(objId);

                const objid = document.createElement("h4");
                objid.textContent = objId;

                col.appendChild(img);
                col.appendChild(objid);
                col.appendChild(title);
                row.appendChild(col);
            })
            .catch(err => console.error(err));
    });

    // pagination
    pagination.innerHTML = "";
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
                renderSearchObjectsPage(allObjects, pageNumber, itemsPerPage,query,takenFromStack);
            });
        }
        li.appendChild(a);
        return li;
    }

    pagination.appendChild(createPageLi(page - 1, "Prev", false, page === 1));
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
    if (page > 1) pagination.appendChild(createPageLi(page - 1));
    pagination.appendChild(createPageLi(page, page, true));
    if (page < totalPages) pagination.appendChild(createPageLi(page + 1));
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
    pagination.appendChild(createPageLi(page + 1, "Next", false, page === totalPages));
}


