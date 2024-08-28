import base64, logging, time, jsonpickle
from flask import Flask, request
from flask_socketio import SocketIO, emit
from config import *

PORT = 5410
LOG_ERR = 0
LOG_INFO = 1

logger = logging.getLogger(__name__)
config = {}
cams = set()

app = Flask(__name__)
socketio = SocketIO(app, async_mode="eventlet")
socketio.init_app(app)

def log(msg, type=LOG_INFO):
    if msg and config.get("logging"):
        if type == LOG_INFO:
            logging.info(msg)
        else:
            logging.error(msg)

def load_cams_ips():
    global cams
    with open(config['cams_save_file']) as f:
        cams = jsonpickle.decode(f.read())



def save_cams_ips():
    global cams
    cams_json = jsonpickle.encode(cams)
    
    with open(config['cams_save_file'], 'w') as f:
        f.write(cams_json)


@socketio.on('connect')
def test_connect():
    cam_ip = request.remote_addr
    if cam_ip not in cams:
        cams.add(cam_ip)    # For distinguishing cameras
        msg = f"New camera added - {cam_ip}: {time.time()}"
        log(msg, type=LOG_INFO)
        print(msg)
        save_cams_ips()
    else:
        print(f"Camera connected: {cam_ip}")

@socketio.on('disconnect')
def test_disconnect():
    print('Camera disconnected')

@socketio.on('message')
def handle_message(msg):
    print("Recieved message: " + msg)

@socketio.on('image_data')
def handle_image_data(data):
    try:
        #print("Image recieved")
        with open("image.png", "wb") as f:
            f.write(base64.b64decode(data))
    except:
        print("Error handling image data")

def init():
    global config
    global cams

    # Create configuration file if it doesn't exist 
    if not config_exists():
        create_config()

    # Init the config dict with the config file
    config = read_config()

    # Load the saved cams ip
    try:
        cams = load_cams_ips()
    except Exception as ex:
        print("Error while openening cams save file, or it doesn't exist")
    
    logging.basicConfig(filename=config['log_location'], level=logging.INFO)

    socketio.run(app, host="0.0.0.0", port=PORT, debug=True)

if __name__ == "__main__":
    init()