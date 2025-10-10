export function loadObjectDetail(objId,takenFromStack = 0) {
    const pageContent = document.getElementById("pageContent");
    pageContent.innerHTML = "<p>Loading...</p>";

    // 1️⃣ Učitaj HTML šablon
    fetch("../components/itemView.html")
        .then(res => res.text())
        .then(html => {
            pageContent.innerHTML = html;

            // 2️⃣ Kad se HTML ubaci, onda uzmi podatke o objektu
            return fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objId}`);
        })
        .then(res => res.json())
        .then(objData => {
            // 3️⃣ Popuni polja
            document.getElementById("itemImage").src = objData.primaryImageSmall || "../assets/noImage.png";
            document.getElementById("itemTitle").textContent = objData.title || "Unknown Title";
            document.getElementById("itemArtist").textContent = objData.artistDisplayName || "Unknown Artist";
            document.getElementById("itemDepartment").textContent = objData.department || "Unknown";
            document.getElementById("itemDate").textContent = objData.objectDate || "N/A";
            document.getElementById("itemMedium").textContent = objData.medium || "N/A";
            document.getElementById("itemCulture").textContent = objData.culture || "N/A";
            if(takenFromStack === 0) {
                const stateObj = { pageType: 'itemDetails',"objId" : objId };
                const url = `/?itemName=${objData.title || "Unknown Title"}`;
                history.pushState(stateObj, `detailsItem`, url);
            }
            // 4️⃣ Dugme za povratak (možeš povezati sa home view)
            document.getElementById("backButton").addEventListener("click", (e) => {
                e.preventDefault();
                window.goToHome(); // funkcija iz navbar.js
            });
        })
        .catch(err => {
            console.error(err);
            pageContent.innerHTML = "<p>Error loading item details.</p>";
        });
}
