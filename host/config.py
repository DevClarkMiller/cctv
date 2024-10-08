import os.path, configparser

CONFIG_DIR = 'config'
CONFIG_NAME = f'{CONFIG_DIR}/config.ini'

def create_config():
    # Create config parser
    config = configparser.ConfigParser()

    if not os.path.exists(CONFIG_DIR):
        os.makedirs(CONFIG_DIR)

    # Add sections with a key-value pair
    config["Logging"] = {"logging": True, "log_location": "server.log"}
    config["Cams"] = {"base_path": "footage", "save_file": "config/cams.json"}

    with open(CONFIG_NAME, 'w') as configfile:
        config.write(configfile)

def read_config():
    # Create config parser
    config = configparser.ConfigParser()

    # Read in the config file
    config.read(CONFIG_NAME)

    # Access values from the config file / Return a dictionary with the values
    return {
        'logging': config.getboolean('Logging', 'logging'),
        'log_location': config.get('Logging', 'log_location'),
        'cam_base_path': config.get('Cams', 'base_path'),
        'cams_save_file': config.get('Cams', 'save_file')
    }

def config_exists(): return os.path.isfile(CONFIG_NAME)