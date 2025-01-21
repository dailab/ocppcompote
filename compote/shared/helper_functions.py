import json
import inspect
import logging
import os, pathlib
import sys
from datetime import datetime, date

import numpy as np
from pythonjsonlogger import jsonlogger

from ocpp import charge_point


async def get_json_import_from_file(path):
    """Get the json representation of a file and convert to snake case using MobilityHouse library
    Args:
        path (str): the path to be used for import of json file
    Returns
        dict: the converted snake case representation of the json file
    """
    json_rep = await json.load(open(path))
    converted_rep = await charge_point.camel_to_snake_case(json_rep)
    return converted_rep


def setup_logging(log_folder: str = None):
    """Set up various logger functions for csms
    Args:
        log_folder (str): the log folder to be used for logged files
    Returns
        str: the path of the log file
    """
    # Determine the log folder path
    p = pathlib.Path(__file__)
    default_log_folder = str(p.parents[1]) + "/tmp/"
    log_folder = log_folder or default_log_folder

    format_str = '%(asctime)%(message)%(levelname)%(name)'
    formatter = jsonlogger.JsonFormatter(format_str)
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    root_logger = logging.getLogger()

    log_file_name = os.path.basename(inspect.stack()[1].filename) + "_" + str(hash(sys)) + ".log"
    log_file_path = log_folder + log_file_name

    if not any(isinstance(handler, logging.FileHandler) for handler in root_logger.handlers):
        file_handler = logging.FileHandler(log_file_path)
        file_handler.setFormatter(formatter)
        root_logger.addHandler(file_handler)

    if not root_logger.hasHandlers():
        root_logger.addHandler(file_handler)

    if not any(isinstance(handler, logging.StreamHandler) for handler in root_logger.handlers):
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        root_logger.addHandler(console_handler)

    app_logger = logging.getLogger('csms_ws_handler')
    app_logger.setLevel(logging.DEBUG)

    for handler in root_logger.handlers:
        if not app_logger.hasHandlers():
            app_logger.addHandler(handler)

    websockets_logger = logging.getLogger('websockets')
    websockets_logger.setLevel(logging.DEBUG)

    websockets_logger.propagate = False

    for handler in root_logger.handlers:
        if not websockets_logger.hasHandlers():
            websockets_logger.addHandler(handler)

    return log_file_path


async def log_tail(f, lines=20, _buffer=4098):
    """Get the tail end of a lines found in a file
    Args:
        lines (int): the lines to get from the tail end
        _buffer (int): the buffer size for processing file
    Returns
        list: the list of lines
    """
    file = f
    f = open(file, "r")
    lines_found = []
    block_counter = -1

    while len(lines_found) < lines:
        try:
            f.seek(block_counter * _buffer, os.SEEK_END)
        except IOError:
            f.seek(0)
            lines_found = f.readlines()
            break

        lines_found = f.readlines()
        block_counter -= 1

    return lines_found[-lines:]


async def log_json(f, _buffer=4098):
    """Read the entire log file and return its contents as JSON objects.

    Args:
        f (str): Path to the log file.
        _buffer (int): Buffer size for processing the file.

    Returns:
        list: A list of JSON objects representing the log entries.
    """
    file = f
    log_entries = []

    try:
        with open(file, "r") as log_file:
            for line in log_file:
                try:
                    log_entry = json.loads(line)
                    log_entries.append(log_entry)
                except json.JSONDecodeError:
                    continue
    except FileNotFoundError:
        raise ValueError(f"File {file} not found.")
    except Exception as e:
        raise ValueError(f"An error occurred while reading the file: {e}")

    return log_entries

def log_json_sync(f, _buffer=4098):
    """Read the entire log file and return its contents as JSON objects.

    Args:
        f (str): Path to the log file.
        _buffer (int): Buffer size for processing the file.

    Returns:
        list: A list of JSON objects representing the log entries.
    """
    file = f
    log_entries = []

    try:
        with open(file, "r") as log_file:
            for line in log_file:
                try:
                    log_entry = json.loads(line)
                    log_entries.append(log_entry)
                except json.JSONDecodeError:
                    continue
    except FileNotFoundError:
        raise ValueError(f"File {file} not found.")
    except Exception as e:
        raise ValueError(f"An error occurred while reading the file: {e}")

    return log_entries

# Utils
# Returns True if x is JSON serializable
def is_jsonable(x):
    try:
        json.dumps(x)
        return True
    except (TypeError, OverflowError):
        return False

# Converts d to JSON serializable dict by replacing non-jsonable values with None
def convert_dict_recursive(d: dict):
    new_d = {}
    for key in d.keys():
        if isinstance(d[key], dict):
            new_d[key] = convert_dict_recursive(d[key])
            continue
        if isinstance(d[key], (datetime, date)):
            new_d[key] = d[key].isoformat()
            continue
        if not is_jsonable(d[key]):
            new_d[key] = None
            continue
        new_d[key] = d[key]
    return new_d


class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, np.int32) or isinstance(obj, np.int64):
            return obj.item()
        return json.JSONEncoder.default(self, obj)

def default_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()  # Convert to ISO 8601 string
    raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")