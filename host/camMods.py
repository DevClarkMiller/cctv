import jsonpickle, time, globals, os
from datetime import datetime

def load_cams_ips():
    with open(globals.config['cams_save_file']) as f:
        return jsonpickle.decode(f.read())

def save_cams_ips():
    cams_json = jsonpickle.encode(globals.cams)
    
    with open(globals.config['cams_save_file'], 'w') as f:
        f.write(cams_json)

# def create_cam_dir(cam_ip):
#     base_path = globals.config["cam_base_path"]

#     try:
#         # Create base base dir if it doesn't exist
#         if not os.path.exists(base_path):
#             os.makedirs(base_path)

#         cam_dir = globals.ip_to_dir(cam_ip)
        
#         full_path = os.path.join(os.path.abspath(base_path), cam_dir)

#         if not os.path.exists(full_path):
#             os.makedirs(full_path)

#     except PermissionError as e:
#         msg = "Error when creating dir, incorrect permissions"
#         print(msg)
#         globals.log(msg, type=globals.LOG_ERR)

#     except OSError as e:
#         msg = "Error when creating dir, path incorrect"
#         print(msg)
#         globals.log(msg, type=globals.LOG_ERR)

def init_new_cam(cam_ip):
    globals.cams[cam_ip] = globals.ip_to_dir(cam_ip)    # For distinguishing cameras
    msg = f"New camera added - {cam_ip}: {time.time()}"
    globals.log(msg, type=globals.LOG_INFO)
    print(msg)
    save_cams_ips()

    # # Then create a directory for this camera with it's associated video stream
    # create_cam_dir(cam_ip)