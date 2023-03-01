//similar to pastes

const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

function list(req, res) {
  res.json({ data: urls });
}

let lastUrlsId = urls.reduce((maxId, url) => Math.max(maxId, url.id), 0)

function bodyHasHref(req, res, next) {
  const { data: { href } = {} } = req.body;
  if (href) {
    return next();
  }
  next({
    status: 400,
    message: "An 'href' property is required.",
  });
}



function create(req, res) {
  const { data: { href } = {} } = req.body;
  const newUrl = {
    id: ++lastUrlsId, // Increment last id then assign as the current ID
    href,
  };
  urls.push(newUrl);
  res.status(201).json({ data: newUrl });
}


function update(req, res) {
  const url = res.locals.url
  //   const { urlId } = req.params;
//   const foundUrl = urls.find((url) => url.id === Number(urlId));
  const { data: { href} = {} } = req.body;

  // Update the url
  url.href = href;


  res.json({ data: url });
}


function urlExists(req, res, next) {
  const { urlId } = req.params;
  const foundUrl = urls.find((url) => url.id === Number(urlId));
  if (foundUrl) {
    res.locals.url = foundUrl;
    return next();
  }
  next({
    status: 404,
    message: `Url id not found: ${urlId}`,
  });
}


function read(req, res) {
  let newUse = {
      urlId: res.locals.url.id,
      id: uses.length + 1,
      time: Date.now(),
      };
  uses.push(newUse);
  res.json({ data: res.locals.url });

}



module.exports = {
  create: [bodyHasHref, create],
  list,
  read: [urlExists, read],
  update: [urlExists, bodyHasHref, update],
  urlExists
};


