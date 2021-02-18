
// ATTENTION: this script uses ES6 module syntax in order
// to be able to use the "await" keyword on the top level of the script.
// (This is configured by setting "type": "module" in the package.json)
// This means you are not able to use require(...) to import modules,
// but have to use the new ES6 syntax "import ... from ...".

// For an explanation see 
// https://redfin.engineering/node-modules-at-war-why-commonjs-and-es-modules-cant-get-along-9617135eeca1

import puppeteer from "puppeteer";
import { promises as fs } from "fs";

const browser = await puppeteer.launch({
  defaultViewport: { // browser window size
    width: 1024,
    height: 6000
  },
  devtools: false   // set to true for debugging *on the page*
});

const page = await browser.newPage();

await page.goto('https://cartography.tuwien.ac.at/');

// wait for a specific element to be created on the page,
// in case some content is rendered by JavaScript
await page.waitForSelector('#masthead');

// Saving a screenshot is really easy - note the large window size 
// we have defined above in order to capture the whole page
await page.screenshot({ path: 'screenshot.png' });


// The following function will be run *on the page in the browser*
// Attention: you cannot use any functions or data defined elsewhere 
// in this script inside this function, since the function is transferred
// to the browser and executed there and not in the context of the current script!
// Any data you need has to be passed in by arguments, and passed out by return value.

function getAllText(selector) {
  // Collect the text content of all elements identified by selector
  
  // uncomment next line and set "debugger: true" in puppeteer.launch() above
  // to launch debugger in the browser! (Useful to try things out and investigate page structure)
  
  // debugger;
  
  let elements = document.querySelectorAll(selector);
  let result = [];
  for (let el of elements) {
    result.push(el.textContent);
  }
  return result;
}
  
// Run the function defined above above on the page
// (function is followed by the arguments that get passed to the function)
let allHeadlines = await page.evaluate(getAllText, "h1,h2,h3,h4,h5,h6" ); 

console.log();
console.log("Today's Headlines:");
console.log("==================");
console.log(allHeadlines.join("\n"));
console.log();

await fs.writeFile("headlines.txt", allHeadlines.join("\n"));
console.log("Screenshot saved to 'screenshot.png', headlines saved to 'headlines.txt'.");
console.log();

await browser.close();
