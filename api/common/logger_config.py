import logging

def setup_logger():
    logger = logging.getLogger("flask_neo4j_logger")
    logger.setLevel(logging.DEBUG)

    # Crear un manejador de consola
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)

    # Formato del logger
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(formatter)

    # Agregar el manejador al logger
    if not logger.handlers:
        logger.addHandler(console_handler)

    return logger

# Crear la instancia del logger
logger = setup_logger()