"""
Usage example:
python extract_checklist_info.py --input_file "~/Downloads/dwca-aafc-brassicaceae-checklist-v1.8/taxon.txt"
--dataset_key 94308742-058c-46d5-b763-06e9207a6b15 --output_file "_data/example.yml"
"""
import argparse
import pandas as pd
import requests


def _parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input_file', required=True,
                        help='path to TSV file to be parsed')
    parser.add_argument('-k', '--dataset_key', required=True,
                        help='datasetKey as set in the checklist')
    parser.add_argument('-o', '--output_file', required=True,
                        help='path to output file')
    return parser.parse_args()


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


def main():
    args = _parse_args()
    data = pd.read_csv(args.input_file, sep='\t')
    df = data[['taxonID', 'scientificName', 'genus', 'taxonRank']]
    df['base_api_string'] = f"https://api.gbif.org/v1/species?datasetKey={args.dataset_key}&sourceId="
    df['taxonID'].map(str)
    df.loc[:, 'search_string'] = df['base_api_string'] + df['taxonID'].astype(str)
    df.loc[:, 'link'] = df.apply(lambda x: get_gbif_link_from_api_call_string(x['search_string']), axis=1)
    df.loc[:, 'line'] = "| " + df['genus'] + " |[ " + df['scientificName'] + "](" + df['link'] + ") | " + df['taxonRank'] + " |"
    df = df[['line']]
    with open(args.output_file, 'a') as f:
        dfAsString = df.to_string(header=False, index=False)
        f.write(dfAsString)


if __name__ == '__main__':
    main()
