var siteTheme = gbifReactComponents.themeBuilder.extend({baseTheme: 'light', extendWith: {
  primary: themeStyle.colors.primary
}});

var siteConfig = {
  rootPredicate: {
    "type": "and",
    "predicates": [
   		{
        "type":"equals",
        "key": "country",
        "value": "CA"
      },
      {
        "type": "equals",
        "key": "notIssues",
        "value": "COUNTRY_COORDINATE_MISMATCH"
      }
    ]
  },
  occurrenceSearchTabs: ['MAP', 'TABLE', 'GALLERY', 'DATASETS'], // possible values are TABLE, MAP, GALLERY, DATASETS
};
