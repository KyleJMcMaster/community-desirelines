from abc import ABC, abstractmethod
import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import errorcode
import uuid
import time
import datetime
import json


class DatabaseManager(ABC):

    @abstractmethod
    def initialize_connection(self):
        pass

    @abstractmethod
    def build_tables(self, tables:str):
        pass

    @abstractmethod
    def save_map(self, data: dict) -> bool:
        pass

class NoneDB(DatabaseManager):

    def initialize_connection(self):
        pass

    def build_tables(self, tables:str):
        pass

    def save_map(self, data: dict) -> bool:
        pass

class MYSQLDB(DatabaseManager):

    def __init__(self):
        self.cnx = None
        self.initialize_connection()

    def initialize_connection(self):
        load_dotenv()
        MYSQLUSER=os.getenv('MYSQLUSER')
        MYSQLPASSWORD=os.getenv('MYSQLPASSWORD')
        MYSQLHOST=os.getenv('MYSQLHOST')
        MYSQLDATABASE=os.getenv('MYSQLDATABASE')

        try:
            self.cnx = mysql.connector.connect(user=MYSQLUSER,
                                            password=MYSQLPASSWORD,
                                            host=MYSQLHOST,
                                            database=MYSQLDATABASE)
        
        except mysql.connector.Error as e:
            raise ConnectionError(e)
        if self.cnx and self.cnx.is_connected():
            print('connection successful')
            # self.cnx.close()

    def disconnect(self):
        if self.cnx and self.cnx.is_connected():
            self.cnx.close()

    def build_tables(self, tables:str):
        pass

    def save_map(self, data: dict) -> bool:
        """
        Save a map design as a feature collection according to database schema
        """
        if not self.cnx.is_connected():
            try:
                self.initialize_connection()
            except mysql.connector.Error as e:
                raise ConnectionError(e)
            
        cursor = self.cnx.cursor()

        add_collection = ("INSERT INTO feature_collections "
                          "VALUES (%s, %s, %s, %s)")
        add_feature = ("INSERT INTO features "
                       "VALUES (%s, %s, %s, %s, ST_GeomFromGeoJSON(%s))")

        collection_id = uuid.uuid4()
        creation_date = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
        creation_source = None
        is_shared = False

        try:
            creation_source = data['creation_source']
        except KeyError:
            print('no creation source supplied')

        try:
            is_shared = data['is_shared']
        except KeyError:
            print('no sharing permissions supplied')
            raise KeyError('no sharing permissions supplied')

        try:
            features = data['geojson']['features']
        except KeyError:
            raise KeyError('No features supplied')
        
 
        cursor.execute(add_collection, (str(collection_id), creation_date, creation_source, 1 if is_shared == 'true' else 0))

        for feature in features:
            feature_id = uuid.uuid4()
            try:
                geometry_type = feature['geometry']['type']
            except KeyError:
                raise KeyError('Missing geometry or type')
                
            
            try:
                feature_type = feature['properties']['feature_type']
            except KeyError:
                raise KeyError('Missing properties or feature_type')
                
            
            try:
                geometry = feature['geometry']
            except KeyError:
                raise KeyError('Missing geometry')
                
            
            cursor.execute(add_feature, (str(feature_id), str(collection_id), geometry_type, feature_type, json.dumps(geometry)))

        self.cnx.commit()
        cursor.close()
            
