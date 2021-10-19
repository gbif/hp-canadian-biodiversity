"""
Extracts data from dwca taxon.txt file of the checklists and writes it in markdown format.

!Important! Requires modifications based on the columns of interest in the checklist.

Usage example:
python extract_checklist_info.py --input_file "~/Downloads/dwca-aafc-hymenoptera-canada-ak-gl-v2.0/taxon.txt" --dataset_key 94308742-058c-46d5-b763-06e9207a6b15 --output_file "_data/example.yml"
"""
import argparse
import numpy as np
import pandas as pd
import requests

COLUMNS_OF_INTEREST = ['taxonID', 'scientificName', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus',
                       'subgenus', 'taxonRank']


def _parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input_file', required=True,
                        help='path to TSV file to be parsed')
    parser.add_argument('-k', '--dataset_key', required=True,
                        help='datasetKey as set in the checklist')
    parser.add_argument('-o', '--output_file', required=True,
                        help='path to output file')
    return parser.parse_args()


def get_gbif_link(taxon_id, dataset_key):
    api_call_string = f"https://api.gbif.org/v1/species?datasetKey={dataset_key}&sourceId={taxon_id}"
    resp = requests.get(api_call_string)
    if resp.ok:
        results = resp.json()['results']
        if len(results) != 1:
            print(f'Results length {len(results)} not 1. {api_call_string}')
            return None
        k = results[0]['key']
        return f'https://www.gbif.org/species/{k}/verbatim'
    else:
        print(f'Error getting GBIF link for taxonID {taxon_id}, dataset_key {dataset_key}.\n {resp.text}')


def main():
    args = _parse_args()
    data = pd.read_csv(args.input_file, sep='\t')
    df = data[COLUMNS_OF_INTEREST]
    df['has_numeric_tID'] = np.where(df['taxonID'].str.isnumeric(), True, False)
    df.loc[:, 'link'] = df.apply(lambda x: get_gbif_link(x['taxonID'], args.dataset_key)
                        if x['has_numeric_tID'] else x['taxonID'], axis=1)
    df.loc[df.taxonRank == 'family', 'Scientific Name'] = "[ "
    df.loc[df.taxonRank == 'genus', 'Scientific Name'] = "&nbsp;[ "
    df.loc[df.taxonRank == 'subgenus', 'Scientific Name'] = "&nbsp;&nbsp;[ "
    df.loc[df.taxonRank == 'species', 'Scientific Name'] = "&nbsp;&nbsp;&nbsp;[ "

    df['Scientific Name'] = df['Scientific Name'] + df['scientificName'] + "](" + df['link'] + ")"
    df[['Scientific Name', 'taxonRank']].to_markdown(buf=args.output_file, index=False)


if __name__ == '__main__':
    main()
