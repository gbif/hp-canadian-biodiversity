---
layout: gbifData
description: Default template for occurrence search
permalink: /fr/litterature/de
---
<div id='root'></div>

<script>
  var userTheme = typeof siteTheme !== 'undefined' ? siteTheme : undefined;
  var userConfig = {};
  
  ReactDOM.render(
    React.createElement(
      gbifReactComponents.LiteratureSearch,
      {
        config: {
          rootFilter: {countriesOfResearcher: ['CA']},
          excludedFilters: ['countriesOfResearcher'],
          highlightedFilters: ['q', 'countriesOfCoverage', 'year']
        }, 
        style: { height: 'calc(100vh - 4.25rem)' }
      }
    ),
    document.getElementById('root')
  );

  if (typeof userTheme === 'undefined') {
    console.warn('No theme defined - using default styling');
  }
  if (typeof userConfig === 'undefined') {
    console.warn('No config provided - all data will be shown');
  }
</script>