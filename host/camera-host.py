import base64, logging, time, globals, json, os, io
from datetime import datetime
from moviepy.editor import ImageSequenceClip
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import tempfile
from config import *
from camMods import *

PORT = 5410
cam_video = {}  # Dictionary of the base64 frame from each active camera
connected_viewers = {}  # Contains the ips of the cameras the viewer wants to see
viewer_sids = {}    # Contains the sid for each viewer who connects

logger = logging.getLogger(__name__)
app = Flask(__name__)
CORS(app)
cors = CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
})
socketio = SocketIO(app, async_mode="eventlet", cors_allowed_origins="*")
socketio.init_app(app)

# Converts the set to a list, then to json and returns 
def json_cams_list():
    return list(globals.connected_cams)

def parse_range(dir, start_stamp, end_stamp):
    frames = []
    try:
        for filename in os.listdir(dir):
            f = os.path.join(dir, filename)

            if os.path.isfile(f):
                name, _ = os.path.splitext(os.path.basename(f)) # Gets the time stamp of the frame
                file_stamp = int(float(name))

                stamp_in_range = file_stamp >= start_stamp and file_stamp <= end_stamp

                if stamp_in_range:
                    frames.append(f)

    except PermissionError as e:
        print(f"PERMISSION ERROR: {e}")
    except RecursionError as e:
        print(f"RECURSION ERROR: {e}")
    except Exception as e:
        print(f"EXCEPTION: {e}")

    finally:
        return frames

def get_range_imgs(ip, start, end):
    start_day = datetime.fromtimestamp(int(start)).strftime('%Y_%m_%d') 
    end_day = datetime.fromtimestamp(int(end)).strftime('%Y_%m_%d') 

    dir_ip = globals.ip_to_dir(ip)

    start_day_dir = f"{globals.config.get('cam_base_path')}/{start_day}/{dir_ip}"
    end_day_dir = f"{globals.config.get('cam_base_path')}/{end_day}/{dir_ip}"
    same_day = start_day_dir == end_day_dir

    if not os.path.exists(start_day_dir) or not os.path.exists(end_day_dir):
        return None
    
    frame_paths = []

    start = int(start)
    end = int(end)

    # Merge the lists if image data was found, this is in order
    if same_day:
        frame_paths += parse_range(start_day_dir, start, end)
    else:
        frame_paths += parse_range(start_day_dir, start, end)
        frame_paths += parse_range(end_day_dir, start, end)

    # print(frame_paths)
    print(f"NUM FRAMES FOUND: {len(frame_paths)}")

    # Create video clip from the image sequence
    clip = ImageSequenceClip(frame_paths, fps=24)

    # Create a temporary file to store the video
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_file:
        # Write video to temporary file
        temp_file_path = temp_file.name
        clip.write_videofile(temp_file_path, codec="libx264", audio=False)

    # Read the video file and convert to base64
    with open(temp_file_path, 'rb') as video_file:
        video_base64 = base64.b64encode(video_file.read()).decode('utf-8')

    return video_base64

# Returns a file for each of the requested cams for the requested times
@app.route('/createFootageVid', methods=['POST'])
def get_footage():
    cam_ips = request.get_json()

    vids = []

    for ip in cam_ips:
        vals = cam_ips[ip]
        start = vals["start"]
        end = vals["end"]

        print(start, end)

        base64Vid = get_range_imgs(ip, start, end)
        vids.append(base64Vid)

    return jsonify(vids)

# Return the ips that have connected to the host server before
@app.route('/getFootageIps')
def get_footage_ips():
    return jsonify(list(globals.cams.keys()))

# @socketio.on('connect')
# def test_connect():
#     # Creates a directory for the day if it doesn't already exist
    

# TODO - TAKE IN USER ACCOUNT AND ONLY RETURN WHATEVER CAMERAS THEY HAVE ACCESS TO
@socketio.on('connect-viewer')
def connect_viewer(user):
    if user is None:
        print("No user provided")
        return emit('available-cameras', [])
    
    print(f'User joined as: {user}')
    viewer_sids[request.sid] = user

    connected_viewers[user] = []   # Inits the viewer with an empty array of ips
    cams = json_cams_list()
    print(f'Available cams: {cams}')
    emit('available-cameras', cams)

@socketio.on('select-streams')
def user_select_streams(req):
    user = req.get("user")
    selected_streams = req.get("selected_streams")

    if user is None or selected_streams is None:
        emit('streams-error', 'No account provided or streams selected')

    if selected_streams is not None:
        connected_viewers[user] = selected_streams

    emit('streams-set', 'Streams now available to be recieved')

@socketio.on('fetch-streams')
def fetch_streams(user):
    selected_streams = connected_viewers.get(user)

    if selected_streams is None:
        emit("streams-error", 'No streams selected!')

    stream_data = []

    for ip in selected_streams:
        cam_feed = cam_video.get(ip)
        if cam_feed != None:
            stream_data.append({ip: cam_feed})

    emit("streams-feed", stream_data)

# TODO - ALLOW USERS TO POP CAMS FROM THEIR SELECTED LIST
# @socketio.on()

# When a camera connects
@socketio.on('connect-cam')
def connect_cam(msg):
    globals.create_daily_dir()
    cam_ip = request.remote_addr
    globals.cams_sid[request.sid] = cam_ip   # Maps this cams ip to this sockets sid
    globals.connected_cams.add(cam_ip)

    # Checks if the cameras ip hasn't been saved yet, if not, 
    # update the save file and do some other things :)
    if cam_ip not in globals.cams.keys(): init_new_cam(cam_ip)
    else: print(f"Camera connected: {cam_ip}")

    if cam_ip not in globals.cam_frames_recieved.keys():
        globals.cam_frames_recieved[cam_ip] = 0

    print(f"{cam_ip} - frame count: {globals.cam_frames_recieved.get(cam_ip)}")

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
    sid = request.sid

    # Removes the ip from connected cams if that's where it's coming from
    if sid in globals.cams_sid.keys():
        globals.connected_cams.remove(ip)
        cam_video.pop(ip)
        globals.cams_sid.pop(sid)
        print(f"Camera disconnected: {ip}")
    elif sid in viewer_sids.keys():
        user = viewer_sids.get(sid)
        try:
            connected_viewers.pop(user)
            print(f'User {user} disconnected')
        except:
            print(f'Disconnected user: {user} was never connected!')

@socketio.on('message')
def handle_message(msg):
    print("Recieved message: " + msg)

@socketio.on('image_data')
def handle_image_data(data):
    cam_ip = request.remote_addr
    try:
        # Add the base64 encoded frame as the value for this cameras ip in the dictionary
        cam_video[cam_ip] = data    
        globals.cam_frames_recieved[cam_ip] += 1
        decoded_vid = base64.b64decode(data)

        timestamp = time.time()

        cam_dir = globals.cam_dirs.get(cam_ip)

        # Only archive if the cams dir exists and the frame number is odd to save space
        if cam_dir != None and globals.cam_frames_recieved[cam_ip] % 2 == 0:
            with open(f"{cam_dir}/{timestamp}.jpg", "wb") as f:
                f.write(decoded_vid)

        # Writes to the access file for the cam
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