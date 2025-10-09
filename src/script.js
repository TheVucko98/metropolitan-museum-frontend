
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

