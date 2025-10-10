
import { loadNavbar} from "./scripts/navbar.js";
loadNavbar()

import { loadFooter } from "./scripts/footer.js";
loadFooter()


import {loadDepartment} from "./scripts/department.js";
window.loadDepartment = loadDepartment;


import {goToHome,goToAbout} from "./scripts/navbar.js";
window.goToAbout = goToAbout;
window.goToHome = goToHome;


import {loadObjectDetail} from "./scripts/itemDetails.js";

window.loadObjectDetail = loadObjectDetail;

import {getSearchResults} from "./scripts/search.js";

window.getSearchResults = getSearchResults;

// So i can go back and forward
window.addEventListener('popstate', (event) => {
    const state = event.state;
    if (!state) return; // kad nema state (npr. prvi load)

    if (state.pageType === 'department') {

        loadDepartment(state.departmentID || 1, state.pageNumber || 1,1);

    }else if(state.pageType === 'home') {
        goToHome(1);
    }else if(state.pageType === 'about') {
        goToAbout(1);
    } else if(state.pageType === 'itemDetails') {
        loadObjectDetail(state.objId,1);
    }
    else if(state.pageType === 'search') {
        getSearchResults(state.query,state.pageNumber,1);
    }

});

// So i can go to some page of site by pasting url

window.addEventListener("DOMContentLoaded", () => {
    const pathname = window.location.pathname; // npr. "/home" ili "/about"
    const params = new URLSearchParams(window.location.search);

    if (pathname === "/home") {
        goToHome();
    } else if (pathname === "/about") {
        goToAbout();
    } else if (params.has("departmentID")) {
        const depId = parseInt(params.get("departmentID"));
        const page = parseInt(params.get("pageNumber")) || 1;
        loadDepartment(depId);
    } else if (params.has("objId")) {
        const objId = params.get("objId");
        loadObjectDetail(objId);
    } else if (params.has("Search")) {
        const query = params.get("Search");

        getSearchResults(query);
    } else {
        goToHome(); // If no Get, or whatever
    }
});
