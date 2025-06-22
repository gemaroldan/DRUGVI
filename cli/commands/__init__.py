import logging

# Configurar el logger
logging.basicConfig(
    level=logging.DEBUG,  # Nivel de log: INFO (puede ser DEBUG, ERROR, etc.)
    #format='[%(asctime)s] - %(name)s - %(levelname)s - %(message)s',
    format='[%(asctime)s] p%(process)s {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s',

    handlers=[
        logging.FileHandler("cli.log"),  # Guardar logs en un archivo
        logging.StreamHandler()  # Mostrar logs en la consola
    ]
)

# Al inicializar el paquete, se configura el logger
logger = logging.getLogger(__name__)

logger.info("cli package initialized")
