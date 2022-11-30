from flask import Flask
from os import environ, path

basedir = path.abspath(path.dirname(__file__))

app = Flask(__name__)
app.config['SECRET_KEY'] = environ.get('SECRET_KEY')

app.config.from_object(__name__)
from app import views
