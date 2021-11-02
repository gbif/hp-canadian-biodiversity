
 function getFilter() {
    let searchParams = new URLSearchParams(window.location.search);
    let encodedFilter = searchParams.get("filter");
    if (!encodedFilter) return null;
    return JSON.parse(atob(encodedFilter)).must;
 }

 function hasAAFCSingleCollectionFilter() {
    return (filter.hasOwnProperty('collectionCode') &&
        (filter.collectionCode.length == 1) &&
        (['CNC', 'DAO'].includes(filter.collectionCode[0].toUpperCase())));
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


async function getIds(buttonID){
  let jqueryString = $.param(filter, true);
  let apiString = 'https://api.gbif.org/v1/occurrence/search?' + jqueryString + '&limit=100';
  // still need to convert year range when relevant
  // other bugs with years
  console.log(apiString);
  let response = await fetch(apiString);
  let data = await response.json();
  const ids = await data.results.map(d => d.key);
  if (buttonID == "requestIds") {
    let recipient = getCollectionEmail(filter.collectionCode[0]);
    createMailerMessage(recipient, ids.toString());
  } else {
    //this part not working
    navigator.clipboard.writeText(ids);
    //alert("ID list copied to clipboard.");
  }
 }

 function convertYearRange(yearRangeObject) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
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



