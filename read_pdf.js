const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('C:\\Users\\royal\\Downloads\\AIC HAPPY VALLEY VISION DOCUMENT.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('C:\\Ubuntu\\home\\carol\\Development\\Documents\\code\\work\\aic\\aic-happy-valley\\aic_vision.txt', data.text);
    console.log("PDF extraction complete.");
}).catch(err => {
    console.error(err);
});
