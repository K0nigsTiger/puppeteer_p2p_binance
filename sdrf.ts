const { Cluster } = require('puppeteer-cluster');
const { fileURLToPath } = require('url');
const { dirname } = require('path');
import * as path from 'path'
import * as fs from 'fs'

const _filename = fileURLToPath(require('url').pathToFileURL(__filename).toString());
const _dirname = dirname(_filename);
let obj;

let filepath = path.resolve(_dirname, './directions.json');
fs.readFile(filepath, (err, data) => {
  if(err){
    console.log('Read error');
  }else{
    obj = JSON.parse(data.toString());
  }
});

(async() => {
  try{
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 5,
    });
  
    await cluster.task(async ({ page, data }) => {
      //await page.goto(url);
      await page.goto(data.url);
  
      // Set screen size
      await page.setViewport({width: 1028, height: 1024});
  
      const acceptCookie = '#onetrust-accept-btn-handler';
      const fiatSelector = '#C2Cfiatfilter_searchbox_fiat';
      const directionSelector = '#C2Cpaymentfilter_searchbox_payment';
      const sumSet = '#C2Csearchamount_btn_search';
      const amountSet = '#C2Csearchamount_searchbox_amount';
  
      await page.waitForTimeout(3000);
      await page.waitForSelector(acceptCookie);
      await page.click(acceptCookie);
      await page.waitForTimeout(1000);
  
      await page.type(amountSet, data.sum.toString());
      await page.click(sumSet);
  
      await page.waitForSelector(fiatSelector);
      await page.click(fiatSelector);
      await page.type(`${fiatSelector} input`, 'RUB');
      await page.keyboard.press('Enter', `${fiatSelector} input`);
  
      await page.waitForTimeout(2000);
  
      await page.waitForSelector(directionSelector);
      await page.click(directionSelector);
      console.log(data.dir);
      await page.type(`${directionSelector} input`, data.dir.toString());
      await page.keyboard.press('Enter', `${directionSelector} input`);
  
      await page.waitForTimeout(2000);
  
      const priceDivClass = await page.$eval('div[data-tutorial-id="trade_price_limit"]', element => element.innerHTML.toString().split('"')[1]);
      let selector = '.' + priceDivClass;
      const inner_html = await page.evaluate((selector) => Array.from(document.querySelectorAll(`${selector}`), e => e.innerHTML), selector);
      console.log(inner_html);
  
      let totalSum = 0;
      for(let i = 0; i < data.average; i++){
        totalSum = totalSum + parseFloat(inner_html[i]);
      }
  
      totalSum = parseFloat((totalSum / data.average).toPrecision(4));

      obj.directions.forEach((element, index) => {
        if(element.name == data.dir){
          obj.directions[index].course = totalSum;
          obj.directions[index].datetime = Date.now();
        }
      });

      await page.screenshot({path: path.resolve(_dirname, `./${data.dir}.png`)});
    });
  
    obj.directions.forEach((element) => {
      let info = {url: element.url, dir: element.name, sum: element.sum, average: element.averageCount};
      cluster.queue(info);
    });

    await cluster.idle().then(() => {
      let file = JSON.stringify(obj); 
      fs.writeFile(filepath, file, (err) => {
        if(err){
          console.log('Write error');
        }else{
          console.log(fs.readFileSync(filepath, "utf-8"));
        }
      });
    });

    await cluster.close();
  }
  catch(e){
    console.log(e);
  }
})();