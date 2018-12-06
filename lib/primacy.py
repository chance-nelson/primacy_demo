#!/usr/bin/env python


'''
Desc: Placeholder script for the Primacy pipeline

Authors:
    - Chance Nelson <chance-nelson@nau.edu>
'''


import sys
import json


if __name__ == '__main__':
    json_obj = json.loads(sys.argv[1])

    if 'range-lower' in json_obj and 'range_upper' in json_obj:
        json_obj['range-diff'] = json_obj['range-upper'] - json_obj['range-lower']

    if 'temperature' in json_obj:
        json_obj['temperature-50'] = json_obj['temperature'] + 50

    print(json.dumps(json_obj))