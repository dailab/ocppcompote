import os
import json
from json.decoder import JSONDecodeError

def process_properties(properties, required_properties):
    for key in properties:
        if key in required_properties:
            properties[key]['required'] = True
    return properties

def modify_json(json_data):
    if "properties" not in json_data:
        return None

    modified_data = {"schema": {"properties": process_properties(json_data["properties"], json_data.get("required", []))}}
    return modified_data

def main():
    directory = os.getcwd()

    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            try:
                with open(filename, 'r') as file:
                    data = json.load(file)

                modified_data = modify_json(data)

                if modified_data is None:
                    print(f"Warning: 'properties' key not found in {filename}. Skipping file.")
                else:
                    with open(filename, 'w') as file:
                        json.dump(modified_data, file, indent=2)
            except JSONDecodeError:
                print(f"Error: Unable to parse {filename}. Check the JSON syntax in the file.")

if __name__ == "__main__":
    main()
