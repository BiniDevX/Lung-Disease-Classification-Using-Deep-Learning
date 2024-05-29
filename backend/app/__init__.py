# app/__init__.py

from flask import Flask
from flask_cors import CORS

from .config import Config
from .extensions import db, jwt, migrate

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Import  routes
    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)
   

    return app
