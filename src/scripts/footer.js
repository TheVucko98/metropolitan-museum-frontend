

export function loadFooter(){
    fetch("../components/footer.html")
    .then(response => response.text())
    .then(html=>
        document.getElementById("footer").innerHTML = html

    )
        .catch(error => console.log(error));


}