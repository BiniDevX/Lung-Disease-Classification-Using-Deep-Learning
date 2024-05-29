# app/config.py
import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    # General Config
    SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback-secret-key') 
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Database
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:postgresadmin@localhost/lungappdb'

    UPLOAD_FOLDER = os.path.join(basedir, 'upload')

    # JWT Config
    JWT_SECRET_KEY = os.environ.get("SECRET_KEY")



