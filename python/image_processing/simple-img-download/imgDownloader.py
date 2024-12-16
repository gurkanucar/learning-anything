

from bing_image_downloader.downloader import download
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))


query_string = 'query'

download(query_string, limit=200,  output_dir='./dataset-android',
         adult_filter_off=True, force_replace=False, timeout=60, verbose=True)


