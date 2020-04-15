const cheerio = require("cheerio");
const fetch = require("node-fetch");

const page = (page) =>
  `http://www.rifftrax.com/catalog/all/3571%2C3583%2C3578%2C3587/product-type/b-movie?page=${page}`;

const movies = {};

const getData = (page) =>
  new Promise((resolve) => {
    fetch(page)
      .then((resp) => resp.text())
      .then((html) => {
        const $ = cheerio.load(html);
        $(".product-grid").each(function () {
          movies[$(this).find("a").attr("href")] = {
            href: $(this).find("a").attr("href"),
            img: $(this).find("img").attr("data-src"),
            title: $(this).text().trim(),
          };
        });
        resolve();
      });
  });

(async function () {
  await [1, 2, 3, 4, 5, 6].reduce(async (previousPromise, nextPage) => {
    await previousPromise;
    return getData(page(nextPage));
  }, Promise.resolve());
  console.log(JSON.stringify(Object.values(movies), null, 2));
})();
