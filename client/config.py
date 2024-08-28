import os.path
import configparser

CONFIG_NAME = 'config.ini'

def create_config():
    # Create config parser
    config = configparser.ConfigParser()

    # Add sections with a key-value pair
    config["Logging"] = {"logging": True, "log_location": "client.log"}
    config["Camera"] = {"show_window": False}
    config["Server"] = {"host": 'http://localhost:5410'}

    with open('config.ini', 'w') as configfile:
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
        'host': config.get('Server', 'host'),
        'show_window': config.getboolean('Camera', 'show_window')
    }

def config_exists():
    return os.path.isfile(CONFIG_NAME)