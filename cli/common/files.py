
import logging
import pandas as pd
import logging
import xml.etree.ElementTree as ET

# Usar el logger configurado en __init__.py
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def load_tsv(file_path, dtype=None):
    """ Load TSV file using pandas """
    try:
        df = pd.read_csv(file_path, sep='\t', dtype=dtype)
        logger.info(f"Loaded TSV file: {file_path}, with {len(df)} records")
        return df
    except Exception as e:
        logger.error(f"Failed to load TSV file: {file_path} - {e}")
        raise

def parse_csv(ctx, param, value):
    """ convert value width , to list vale """    
    if value:
        return [x.strip() for x in value.split(',')]
    return []


def strip_namespace(tag):
    """Remove namespace from XML tag."""
    return tag.split("}")[-1] if "}" in tag else tag


def find_by_path(elem, path):
    """Find text in a nested XML element using dot-separated path."""
    parts = path.split(".")
    for part in parts:
        for child in elem:
            if strip_namespace(child.tag) == part:
                elem = child
                break
        else:
            return None  # Path not found
    return elem.text.strip() if elem.text else None


def parse_element(elem):
    if len(elem) == 0 and not elem.attrib:
        return elem.text

    data = dict(elem.attrib) if elem.attrib else {}

    for child in elem:
        tag = strip_namespace(child.tag)
        if tag in data:
            if not isinstance(data[tag], list):
                data[tag] = [data[tag]]
            data[tag].append(parse_element(child))
        else:
            data[tag] = parse_element(child)

    if elem.text and elem.text.strip():
        data["text"] = elem.text.strip()

    return data


def load_xml_in_batches(xml_file, batch_size=100, fields=None, item_tag="drug"):
    """
    Yield batches of parsed XML objects from a large XML file.
    Allows fields as dict: output_name -> xml.path (e.g. {"id": "metadata.id"})
    """
    if fields is None:
        fields = {}

    context = ET.iterparse(xml_file, events=("end",))
    _, root = next(context)

    batch = []

    for event, elem in context:
        if strip_namespace(elem.tag ) == item_tag:
            main_data = {}
            batch.append(parse_element(elem))

            if len(batch) >= batch_size:
                yield batch
                batch = []

            root.clear()

    if batch:
        yield batch