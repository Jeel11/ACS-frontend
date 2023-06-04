const server_url = "https://acs-bill-calculator.herokuapp.com";
const file_formatter_endpoint = "http://localhost:3000";
const DEMAND_CHARGE_DOC = "DEMAND_CHARGE";
const ENERGY_CHARGE_DOC = "ENERGY_CHARGE";
const FUEL_CHARGE_DOC = "FUEL_CHARGE";
const NIGHT_REBATE_DOC = "NIGHT_REBATE";
const EHV_REBATE_DOC = "EHV_REBATE";
const TOU_DOC = "TOU";
const HTPI = "HTP-I";
const HTPII = "HTP-II";
const HTPIII = "HTP-III";
const HTPIV = "HTP-IV";
const DROP_YEAR = "drop_year";
const DROP_MONTH = "drop_month";
const UPLOAD_YEAR = "upload_year";
const UPLOAD_MONTH = "upload_month";
const UPLOAD_TARIFF = "upload_tariff";

const loadingAnimation = document.createElement('div');
loadingAnimation.id = "loading_animation";
loadingAnimation.className = "loader";

const calculatingAnimation = document.createElement('div');
calculatingAnimation.innerText = "Calculating...";
calculatingAnimation.appendChild(loadingAnimation);