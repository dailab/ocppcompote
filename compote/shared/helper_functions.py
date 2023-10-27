import json
import inspect
import logging
import os, pathlib
import sys

from ocpp import charge_point

async def get_json_import_from_file(path):
    json_rep = await json.load(open(path))
    converted_rep = await charge_point.camel_to_snake_case(json_rep)
    return converted_rep

def setup_logging(log_folder: str = None):
    p = pathlib.Path(__file__)
    path = str(p.parents[1]) + "/tmp/"
    LOGGER = logging.getLogger('root')
    logging.basicConfig(level=logging.INFO)
    log_folder = log_folder or path
    logfile: str = log_folder + os.path.basename(inspect.stack()[1].filename) + "_" + str(hash(sys)) + ".log"
    handler = logging.FileHandler(log_folder + os.path.basename(inspect.stack()[1].filename) + "_" + str(hash(sys)) + ".log")
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    LOGGER.addHandler(handler)
    return logfile

async def log_tail(f, lines=20, _buffer=4098):
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