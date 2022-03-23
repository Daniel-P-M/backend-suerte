const renderOptions = {
    width : 900,   //window.innerWidth; 900
    height :  600  //window.innerHeight; 600
};

const assetsBaseUrl = "./src/assets";

let walkSpeedForward = 1;
let walkSpeedBackwards = -1;

const KEY_FORWARD = "37";
const KEY_BACKWARDS = "39";
const KEY_P = "80";

export default {
    renderOptions,
    assetsBaseUrl,
    walkSpeedForward,
    walkSpeedBackwards,
    KEY_FORWARD,
    KEY_BACKWARDS,
    KEY_P,
};