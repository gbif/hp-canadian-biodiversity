
 function getFilter() {
    let searchParams = new URLSearchParams(window.location.search);
    let encodedFilter = searchParams.get("filter");
    if (!encodedFilter) filter = {};
    else filter = JSON.parse(atob(encodedFilter)).must;
    filter["country"] = 'CA';
    return filter;
 }

 function hasAAFCSingleCollectionFilter() {
    return (filter.hasOwnProperty('collectionCode') &&
        (filter.collectionCode.length == 1) &&
        (['AGRC', 'CNC', 'DAO', 'DAOMC', 'DAOM', 'PGRC'].includes(filter.collectionCode[0].toUpperCase())));
 }

 function updateGetIdButtons() {
    let requestButton = document.getElementById("requestIds");
    filter = getFilter();
    if (filter && hasAAFCSingleCollectionFilter()) {
      requestButton.disabled = false;
    } else {
      requestButton.disabled = true;
    }
 }


async function getIds(buttonID) {
  console.log(filter)
  // still buggy with year range
  if (filter && filter.hasOwnProperty('year')) {
    filter.year = await(convertFilterYears());
  }
  let jqueryString = $.param(filter, true);
  console.log(jqueryString)
  let apiString = 'https://api.gbif.org/v1/occurrence/search?' + jqueryString + '&limit=100';
  console.log(apiString);
  let response = await fetch(apiString);
  let data = await response.json();
  const ids = await data.results.map(d => d.key);
  if (buttonID == "requestIds") {
    let recipient = getCollectionEmail(filter.collectionCode[0]);
    createMailerMessage(recipient, ids.toString());
  } else {
    //this part not working with alert. Need to fix document focus issue
    navigator.clipboard.writeText(ids);
    //alert("ID list copied to clipboard.");
  }
 }

async function convertFilterYears() {
  var years = [];
  filter.year.forEach(e => {
    if (e.type === 'equals') years.push(e.value);
    if (e.type === 'range') {
      let end = e.value.lte;
      let start = parseInt(e.value.gte);
      let individualYears = Array(end - start + 1).fill().map((_, idx) => start + idx);
      years.push(individualYears);
    }
  });
  return years.flat();
 }

function createMailerMessage(recipient, idList) {
    let body = "Request specimen information for the following specimen IDs: " + encodeURIComponent(idList);
    let link =
        "mailto:" +
        recipient +
        "&subject=" +
        encodeURIComponent("Information Request from Hosted-Portal!") +
        "&body=" +
        body;
    window.location.href = link;
}

function getCollectionEmail(collectionCode) {
    //TODO: get email address from collectionCode
    return "cnc@example.com";
}



