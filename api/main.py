from flask import Flask
from routes.api import register_routes
from flask_cors import CORS
from routes.disease_maps import disease_maps_api
from routes.pathways import pathways_api 

app = Flask(__name__)

# Habilita CORS globalmente (para todos los dominios y rutas)
CORS(app)

# Register routes in routes/api.py
register_routes(app)
app.register_blueprint(disease_maps_api)
app.register_blueprint(pathways_api)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
    #app.run(host="0.0.0.0", port=5001, debug=True, use_reloader=True)