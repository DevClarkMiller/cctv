import base64, logging, time, globals
from flask import Flask, request, json
from flask_socketio import SocketIO, emit
from config import *
from camMods import *

PORT = 5410

logger = logging.getLogger(__name__)
app = Flask(__name__)
socketio = SocketIO(app, async_mode="eventlet")
socketio.init_app(app)

@app.route('/runningStreams')
def runningStreams():   # Returns a json with a list of streams that are available to the viewer
    return json.jsonify(list(globals.connected_cams))   # Converts the set to a list, then to json and returns it

@socketio.on('connect')
def test_connect():
    # Creates a directory for the day if it doesn't already exist
    globals.create_daily_dir()

# When a camera connects
@socketio.on('connect-cam')
def connect_cam(msg):
    cam_ip = request.remote_addr
    globals.connected_cams.add(cam_ip)

    # Checks if the cameras ip hasn't been saved yet, if not, 
    # update the save file and do some other things :)
    if cam_ip not in globals.cams.keys(): init_new_cam(cam_ip)
    else: print(f"Camera connected: {cam_ip}")

    # Create a directory in the daily log if the cam doesn't already exist
    cam_name = globals.cams.get(cam_ip)
    if globals.daily_dir_path != None and cam_name != None:
        full_dir = f"{globals.daily_dir_path}/{cam_name}"
        print(full_dir)
        globals.cam_dirs[cam_ip] = full_dir
        if not os.path.exists(full_dir):
            os.makedirs(full_dir)

@socketio.on('disconnect')
def test_disconnect():
    ip = request.remote_addr
    if ip in globals.connected_cams:
        globals.connected_cams.remove(ip)

        print(f"Camera disconnected: {ip}")

@socketio.on('message')
def handle_message(msg):
    print("Recieved message: " + msg)

@socketio.on('image_data')
def handle_image_data(data):
    cam_ip = request.remote_addr
    try:
        decoded_vid = base64.b64decode(data)

        timestamp = time.time()

        cam_dir = globals.cam_dirs.get(cam_ip)

        print(cam_dir)

        if cam_dir != None:
            with open(f"{cam_dir}/{timestamp}.jpg", "wb") as f:
                f.write(decoded_vid)

        cam_name = globals.cams.get(cam_ip)
        if cam_name != None:
            with open(f"{cam_name}.jpg", "wb") as f:
                f.write(decoded_vid)

    except Exception as e:
        print(f"Error handling image data: {e}")
        

def init():
    # Create configuration file if it doesn't exist 
    if not config_exists():
        create_config()

    # Init the config dict with the config file
    globals.config = read_config()

    logging.basicConfig(filename=globals.config['log_location'], level=logging.INFO)

    # Load the saved cams ip
    try:
        globals.cams = load_cams_ips()
        msg = f"Loaded cams - {globals.cams}: {time.time()}"
        print(msg)
        globals.log(msg, type=globals.LOG_INFO)
    except Exception as ex:
        print("Error while openening cams save file, or it doesn't exist")

    socketio.run(app, host="0.0.0.0", port=PORT, debug=True)

if __name__ == "__main__":
    init()