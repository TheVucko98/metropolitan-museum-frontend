
import { loadNavbar} from "./scripts/navbar.js";
loadNavbar()

import { loadFooter } from "./scripts/footer.js";
loadFooter()


import {loadDepartment} from "./scripts/department.js";
window.loadDepartment = loadDepartment;


import {goToHome,goToAbout} from "./scripts/navbar.js";
window.goToAbout = goToAbout;
window.goToHome = goToHome;
goToHome()

import {loadObjectDetail} from "./scripts/itemDetails.js";

window.loadObjectDetail = loadObjectDetail;

import {getSearchResults} from "./scripts/search.js";

window.getSearchResults = getSearchResults;


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

