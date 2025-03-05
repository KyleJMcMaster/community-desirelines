from abc import ABC, abstractmethod
import geopandas as gpd
import matplotlib
import matplotlib.pyplot as plt
import contextily as ctx
import time
import json

class ImageRenderer(ABC):

    @abstractmethod
    def render_image(self, geo_json:dict) -> bytes:
        '''
        renders geo_json information as image file and returns bytes representing image in Base64
        '''

class NoneImageRenderer(ImageRenderer):

    def render_image(self, geo_json:dict) -> bytes:
        return b'0'
    

class GeopandasImageRenderer(ImageRenderer):

    def render_image(self, geojson:dict) -> bytes:

        try:
            if geojson['type'] == 'FeatureCollection':
                print('fix formatting')
        except KeyError:
            geojson = geojson['geojson']

        t1 = time.time()
        matplotlib.use('agg')

        gdf = gpd.GeoDataFrame.from_features(geojson, crs=4326)
        gdf_wm = gdf.to_crs(epsg=3857) #convert to world mercator
        

        ax = gdf_wm.plot(figsize=(10, 10), alpha=0.5, edgecolor='k')
        ax.axis('off')
        ax.set_ylim(5.3857e6, 5.3877e6)
        ax.set_xlim(-8.9688e6, -8.9660e6)
        


        ctx.add_basemap(ax
                        ,source=ctx.providers.OpenStreetMap.Mapnik
                        ,zoom=17)

        plt.savefig('./sample_map.png'
                    ,dpi=400
                    ,bbox_inches='tight'
                    ,pad_inches=0.1)
        
        t2 = time.time()
        print(f'Map Rendered in {t2-t1} sec')
        return None

    


    

# with open('./sample_geo_json.json') as sample:
#     IR = GeopandasImageRenderer()

#     sample = json.loads(sample.read())
#     IR.render_image(sample)
