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
      maxConcurrency: 8, // set to number 1
      monitor: false,
      puppeteerOptions: {
        headless: "new", // set to boolean false
      }
    });
  
    await cluster.task(async ({ page, data }) => {
      await page.goto(data.url);
      await page.setViewport({width: 1028, height: 1024});

      const amountSet = '#C2Csearchamount_searchbox_amount';
      let totalSum = 0;

      await page.waitForSelector(amountSet).then(async() => {
        await page.type(amountSet, data.sum.toString()).then(async() => {
          await page.waitForSelector('.bn-table-tbody').then(async() => {
            const priceDivClass = await page.$eval('.bn-table-tbody', e => e.querySelector('tr').children[1].children[0].children[0].className);
            let selector = '.' + priceDivClass;
            const inner_html = await page.evaluate((selector) => Array.from(document.querySelectorAll(`${selector}`), e => e.innerHTML), selector);
            console.log(inner_html);

            for(let i = 0; i < data.average; i++){
              totalSum = totalSum + parseFloat(inner_html[i]);
            }

            totalSum = parseFloat((totalSum / data.average).toPrecision(4));

          });
        });
      });

      obj.directions.forEach((element, index) => {
        if(element.name == data.dir && element.type == data.type){
          obj.directions[index].course = totalSum;
          obj.directions[index].datetime = Date.now();
        }
      });

      await page.screenshot({path: path.resolve(_dirname, `./${data.dir}-${data.type}.png`)});

    });
  
    obj.directions.forEach((element) => {
      let info = {url: element.url, dir: element.name, sum: element.sum, average: element.averageCount, type: element.type};
      cluster.queue(info);
    });

    await cluster.idle();

    await cluster.close().then(() => {
      let file = JSON.stringify(obj); 
      fs.writeFile(filepath, file, (err) => {
        if(err){
          console.log('Write error');
        }else{
          console.log(fs.readFileSync(filepath, "utf-8"));
        }
      });
    });

  }
  catch(e){
    console.log(e);
  }
})();