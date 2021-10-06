import pandas as pd
import requests

TSV_FILE = "~/Downloads/dwca-aafc-brassicaceae-checklist-v1.8/taxon.txt"
DATASET_KEY = "94308742-058c-46d5-b763-06e9207a6b15"


def get_gbif_link_from_api_call_string(api_call_string):
    resp = requests.get(api_call_string)
    if resp.ok:
        results = resp.json()['results']
        if len(results) != 1:
            print(f'Results length {len(results)} not 1. {api_call_string}')
            return None
        k = results[0]['key']
        return f'https://www.gbif.org/species/{k}/verbatim'
    return None


data = pd.read_csv(TSV_FILE, sep='\t')
df = data[['taxonID', 'scientificName', 'genus', 'taxonRank']]
df['base_api_string'] = "https://api.gbif.org/v1/species?datasetKey=94308742-058c-46d5-b763-06e9207a6b15&sourceId="
df['taxonID'].map(str)
df.loc[:, 'search_string'] = df['base_api_string'] + df['taxonID'].astype(str)
df.loc[:, 'link'] = df.apply(lambda x: get_gbif_link_from_api_call_string(x['search_string']), axis=1)
df.loc[:, 'line'] = "| " + df['genus'] + " |[ " + df['scientificName'] + "](" + df['link'] + ") | " + df['taxonRank'] + " |"
df = df[['line']]
with open('_data/update_on_brassicaceae_checklist.yml', 'a') as f:
    dfAsString = df.to_string(header=False, index=False)
    f.write(dfAsString)




