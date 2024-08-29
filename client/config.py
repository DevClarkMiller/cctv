import os.path
import configparser

CONFIG_DIR = 'config'
CONFIG_NAME = f'{CONFIG_DIR}/config.ini'

def create_config():
    # Create config parser
    config = configparser.ConfigParser()

    if not os.path.exists(CONFIG_DIR):
        os.makedirs(CONFIG_DIR)

    # Add sections with a key-value pair
    config["Logging"] = {"logging": True, "log_location": "client.log"}
    config["Camera"] = {"show_window": False, "width": 640, "height": 480}
    config["Server"] = {"host": 'http://localhost:5410'}

    with open(CONFIG_NAME, 'w') as configfile:
        config.write(configfile)

def read_config():
    # Create config parser
    config = configparser.ConfigParser()

    # Read in the config file
    config.read(CONFIG_NAME)

    cam_width = config.getint('Camera', 'width')
    cam_height = config.getint('Camera', 'height')

    # Access values from the config file / Return a dictionary with the values
    return {
        'logging': config.getboolean('Logging', 'logging'),
        'log_location': config.get('Logging', 'log_location'),
        'host': config.get('Server', 'host'),
        'show_window': config.getboolean('Camera', 'show_window'),
        'resolution': (cam_width, cam_height)   # Pack a tuple with the resolution of the camera
    }

def config_exists():
    return os.path.isfile(CONFIG_NAME)