import cv2, asyncio, base64
import socketio, logging, time, signal
from config import *

SLEEP_DURATION = 0.09

sio = socketio.AsyncClient()
uri = 'http://localhost:5410'
config = {}
logger = logging.getLogger(__name__)
running = True

def signal_handler(signum, frame):
    global running
    msg = f"Client now exiting: {time.time()}"
    print(msg)
    if config.get("logging"): logging.info(msg)

    running = False

# Register the signal handler
signal.signal(signal.SIGINT, signal_handler)

@sio.event
def connect():  # Function names match the event name
    if config.get("logging"): logging.info(f"Successfully connected to the server: {time.time()}")

async def send_feed(buffer):
    try:
        await sio.emit('image_data', buffer)
        if config.get("logging"): logging.info(f"Image sent: {time.time()}")

        await sio.sleep(SLEEP_DURATION)
    except:
        if config.get("logging"): logging.error("Error with sending feed to server")

async def test_connection():
    try:
        await sio.emit("message", "This is a test message")
    except:
        print("Something went wrong while testing connection")

async def capture_and_send():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open video capture.")
        await sio.disconnect()
        return
    
    try:
        while(True):
            ret, frame = cap.read()

            if not ret:
                print("Error: Could not read frame.")
                break

            _, buffer = cv2.imencode('.jpg', frame)

            base64_img = base64.b64encode(buffer).decode('utf-8')

            if config["show_window"]:
                cv2.imshow('frame', frame)

                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

            if running: await send_feed(base64_img)
            else: break

    finally:
        cap.release()
        cv2.destroyAllWindows()

# Try catch prevents ctrl + c in the cmd from throwing an exception, exits gracefully instead
async def main():
    global config
    # Create configuration file if it doesn't exist 
    if not config_exists():
        create_config()

    config = read_config()

    logging.basicConfig(filename=config['log_location'], level=logging.INFO)

    # Connect to the Socket.IO server
    try:
        await sio.connect(uri)  # Can throw a runtime error
    except:    
        msg = f"Couldn't connect to server at host: {config['host']}"
        print(msg)
        if config.get("logging"): logging.error(msg)
        return

    await capture_and_send()

    await sio.disconnect()
    
if __name__ == "__main__":
    asyncio.run(main())