from flask_server import FlaskServer
from image_renderer import GeopandasImageRenderer
from database_manager import MYSQLDB

if __name__ == '__main__':
    app = FlaskServer(db=MYSQLDB(), image_renderer=GeopandasImageRenderer())

