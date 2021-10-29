
 function getFilter() {
    let searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams);
    let encodedFilter = searchParams.get("filter");
    if (!encodedFilter) return null;
    return JSON.parse(atob(encodedFilter)).must;
 }

 function hasAAFCSingleCollectionFilter() {
    return (filter.hasOwnProperty('collectionCode') &&
        (filter.collectionCode.length == 1) &&
        (['CNC', 'DAO'].includes(filter.collectionCode[0])));
 }

 function updateGetIdButtons() {
    requestButton = document.getElementById("requestIds");
    copyButton = document.getElementById("copyIds");
    filter = getFilter();
    if (filter && hasAAFCSingleCollectionFilter()) {
        requestButton.disabled = false;
    } else {
        requestButton.disabled = true;
    }
 }

function get_ids(){
    if (!filter) return;
    jqueryString = $.param(filter, true);
    console.log(jqueryString);
    apiString = 'https://api.gbif.org/v1/occurrence/search?' + jqueryString + '&limit=100';
    // still need to convert year range when relevant
    // other bugs with years
    console.log(apiString);
    fetch(apiString)
    .then(response => response.json())
    .then(data=> {
        var ids =  data.results.map(d => d.key);
        navigator.clipboard.writeText(ids);
        console.log(ids);
    });
 }

 function convertYearRange(yearRangeObject) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
 }



