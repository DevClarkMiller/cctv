import logging, time, os
from datetime import datetime
global config
global cams

# Initial states
config = {} 
connected_cams = set()
mapped_ips_to_dir = {}
cams = {}
cam_dirs = {}

todays_dir = time.time()

daily_dir_path = ""

LOG_ERR = 0
LOG_INFO = 1

# Replace the dots in the cap_ip with underscores
def ip_to_dir(cam_ip):
    return cam_ip.replace(".", "_")

# Creates a dir in the footage folder for the current day
# the dir is made up of sub dirs for each ip from the cams
def create_daily_dir():
    global daily_dir_path
    now = datetime.now()
    date = now.strftime('%Y_%m_%d') # Formats it in a way the system can easily read it

    daily_dir_path = f"{config.get('cam_base_path')}/{date}"

    if not os.path.exists(daily_dir_path):
        os.makedirs(daily_dir_path)

def log(msg, type=LOG_INFO):
    if msg and config.get("logging"):
        if type == LOG_INFO:
            logging.info(msg)
        else:
            logging.error(msg)