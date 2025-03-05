import './style.css';
import './controls.css';
import {Feature, Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Draw, Modify, Snap, Select, Translate} from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Text, Icon, Stroke, Fill, Circle } from 'ol/style';
import { Point, LineString, Geometry } from 'ol/geom';
import {GeoJSON} from 'ol/format';
import Collection from 'ol/Collection';
import { transform, fromLonLat } from 'ol/proj';
import {click, singleClick} from 'ol/events/condition';
// import { Overlay } from 'ol/Overlay';
import Shepherd from 'shepherd.js';




//***********************************//
//               TOUR                //
//***********************************//
const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaults: {
    // cancelIcon: {
    //   enabled: true
    // },
    classes: 'shadow-md bg-purple-dark',
    scrollTo: true
  }
});

// Tutorial Start
tour.addStep({
  title: 'Welcome to the Desire Lines Website',
  text: 'Would you like a walkthrough of the website?',
  attachTo: {
    element: ''
  },
  buttons: [  
    {
      action() {
        return this.cancel();
      },
      text: 'No'
    },  
    {
      action() {
        return this.next();
      },
      text: 'Yes'
    }
  ]
  // id: 'creating'
});

// Step 1
tour.addStep({
  title: 'Desirelines Website Walkthrough',
  text: 'Here you can add, draw, and move icons to design your ideal community.',
  attachTo: {
    element: '.navbar',
    on: 'top-right'
  },
  buttons: [  
    {
      action() {
        return this.cancel();
      },
      text: 'Cancel'
    },  
    {
      action() {
        return this.next();
      },
      text: 'Next'
    }
  ]
  // id: 'creating'
});

// Step 2
tour.addStep({
  title: 'File Menu',
  text: 'Create a new map or save your map design.',
  attachTo: {
    element: '#file',
    on: 'top-right'
  },
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'shepherd-button-secondary',
      text: 'Back'
    },
    {
      action() {
        return this.next();
      },
      text: 'Next'
    }
  ],
  // id: 'creating'
});

// Step 3
tour.addStep({
  title: 'Add Item',
  text: 'Select an item to add, move mouse and click to place the icon',
  attachTo: {
    element: '#add',
    on: 'top-right'
  },
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'shepherd-button-secondary',
      text: 'Back'
    },
    {
      action() {
        return this.next();
      },
      text: 'Next'
    }
  ],
  // id: 'creating'
});

// Step 4
tour.addStep({
  title: 'Draw Item',
  text: 'Draw lines and shapes to signify sidewalks, crosswalks or regions.',
  attachTo: {
    element: '#draw',
    on: 'top-right'
  },
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'shepherd-button-secondary',
      text: 'Back'
    },
    {
      action() {
        return this.next();
      },
      text: 'Next'
    }
  ],
  // id: 'creating'
});

// Step 5
tour.addStep({
  title: 'Select Item(s)',
  text: 'Left-click on an item to select it. Hold the shift button and click on more items for multiselect',
  attachTo: {
    element: '.navbar',
    on: 'top-right'
  },
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'shepherd-button-secondary',
      text: 'Back'
    },
    {
      action() {
        return this.next();
      },
      text: 'Next'
    }
  ],
  // id: 'creating'
});

// Step 6
tour.addStep({
  title: 'Move Item(s)',
  text: 'Click and drag item(s) to move around and change positions.',
  attachTo: {
    element: '.navbar',
    on: 'top-right'
  },
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'shepherd-button-secondary',
      text: 'Back'
    },
    {
      action() {
        return this.next();
      },
      text: 'Next'
    }
  ],
  // id: 'creating'
});

tour.start();

//************************************************//



const layerCollection = new Collection();
var geojsonCollection = [];

const osm = new TileLayer({
  source: new OSM(),
  title: 'OSM Basemap'
})

layerCollection.push(osm);

const map = new Map({
  target: 'map',
  layers: layerCollection,
  view: new View({
    center: fromLonLat([-80.551, 43.4891]),
    zoom: 16,
  })
});


//***********************************//
//         QR CODE DECODING          //
//***********************************//
document.addEventListener('DOMContentLoaded', () => {
  // get query params
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const encodedCoords = urlParams.get('coords');
  const encodedPrompt = urlParams.get('prompt');
  

  if (encodedCoords && encodedPrompt) {
    try {
      // decode
      const coords = atob(encodedCoords);
      const prompt = atob(encodedPrompt);

      // parse coords & set map
      const [lng, lat] = coords.split(',').map(Number);
      // const [lat, lng] = coords.split(',').map(Number);
      const view = new View({
        center: fromLonLat([lng, lat]),
        // center: fromLonLat([lat, lng].reverse()),
        zoom: 16,
      });
      map.setView(view);

      // make and display prompt banner
      const banner = document.createElement('div');
      banner.className = 'banner';
      banner.textContent = prompt;
      document.body.appendChild(banner);
    } catch (error) {
      console.error('Error decoding QR code data: ', error);
    }
  }
})


//***********************************//
//              LEGEND               //
//***********************************//


//***********************************//
//              STYLES               //
//***********************************//

const icons = ["f015", "f207", "e1c5", "f306", "f724", "e2e7"];

// const pointIcon = new Style({
//   text: new Text({
//     // src: iconSrc, // URL of the icon image
//     text: String.fromCodePoint(parseInt('2022', 16)),
//     font: '900 20px "FontAwesome"',
//     scale: 0.07 * 12,
// })
//   });

// console.log("point icon");
// pointIcon.getText().setText(String.fromCodePoint(parseInt('f724', 16)))
// console.log(pointIcon);

// const busIcon = new Style({
//   text: new Text({
//     // src: iconSrc, // URL of the icon image
//     text: String.fromCodePoint(parseInt('f207', 16)),
//     font: '900 20px "FontAwesome"',
//     scale: iconScale * 12,
// })
//   });

// const streetlightIcon = new Style({
//   text: new Text({
//     // src: iconSrc, // URL of the icon image
//     text: String.fromCodePoint(parseInt('e1c5', 16)),
//     font: '900 20px "FontAwesome"',
//     scale: iconScale * 12,
// })
//   });

// const stopSignIcon = new Style({
//   text: new Text({
//     // src: iconSrc, // URL of the icon image
//     text: String.fromCodePoint(parseInt('f306', 16)),
//     font: '900 20px "FontAwesome"',
//     scale: iconScale * 12,
// })
//   });

// const parkIcon = new Style({
//   text: new Text({
//     // src: iconSrc, // URL of the icon image
//     text: String.fromCodePoint(parseInt('f724', 16)),
//     font: '900 20px "FontAwesome"',
//     scale: iconScale * 12,
// })
//   });

// const streetBenchIcon = new Style({
//   text: new Text({
//     // src: iconSrc, // URL of the icon image
//     text: String.fromCodePoint(parseInt('e2e7', 16)),
//     font: '900 20px "FontAwesome"',
//     scale: iconScale * 12,
// })
//   });

const crosswalkStyle = new Style({
  stroke: new Stroke({
    width: 5,
    color: 'black',
    lineDash: [5, 10]
  }),
  zIndex: 1,
});

const selectCrosswalkStyle = [
  crosswalkStyle,
  new Style({
    stroke: new Stroke({
      width: 5,
      color: '#9F2B68',
      lineDash: [5, 10]
    }),
    zIndex: 1,
  })
  ];

const sidewalkStyle = new Style({
  stroke: new Stroke({
    width: 10,
    color: 'grey',
    lineCap: 'square',
  }),
  zIndex: 1,
});

const selectSidewalkStyle = [
  sidewalkStyle,
  new Style({
    stroke: new Stroke({
      color: '#9F2B68',
      width: 15
    }),
    zIndex: 1,
  })
  ];



//***********************************//
//          ADD & DRAW ITEM          //
//***********************************//
const vectSource = new VectorSource();
const vectLayer = new VectorLayer({source: vectSource});
map.addLayer(vectLayer);


console.log("tour", tour.isActive());


let demoPointStyle;
console.log("demo", demoPointStyle);
demoPointStyle = new Style({
  text: new Text({
    text: String.fromCodePoint(parseInt('f3c5', 16)), // Example Unicode for home icon
    font: '900 20px "FontAwesome"',
    scale: 0.07 * 12,
  })
});

// Set coordinates for the demo point
const demoPoint1 = fromLonLat([-80.553893, 43.490262]); // Adjust as needed
const demoPoint2 = fromLonLat([-80.551747, 43.492130]); // Adjust as needed

// Create the demo point feature
const demoPoint1Feature = new Feature({
  geometry: new Point(demoPoint1),
  feature_type: 'demo'
});

const demoPoint2Feature = new Feature({
  geometry: new Point(demoPoint2),
  feature_type: 'demo'
});

// Apply the style to the demo point
demoPoint1Feature.setStyle(demoPointStyle);
demoPoint2Feature.setStyle(demoPointStyle);

// Add the demo point feature to the vector source
vectSource.addFeatures([demoPoint1Feature, demoPoint2Feature]);

tour.on('inactive', function () {
  vectSource.removeFeatures([demoPoint1Feature, demoPoint2Feature]);
});




//***********************************//
//           SELECT LAYER(S)         //
//***********************************//
const selectStyle = feature => {
  const icon = feature.getProperties()['src'];
  const icon2 = feature.getProperties();
  console.log("ICON");
  console.log(icon);
  console.log(icon2);

  let newStyle;
  if (icons.includes(icon)) {
    newStyle = new Style({
      text: new Text({
        // src: iconSrc, // URL of the icon image
        text: String.fromCodePoint(parseInt(icon, 16)),
        font: '900 20px "FontAwesome"',
        scale: iconScale * 12,
        stroke: new Stroke({
          color: '#9F2B68',
          width: 4
        })
      })
    });

    return newStyle;
  }
  else if (icon == 'crosswalk') {
    newStyle = selectCrosswalkStyle;
    return newStyle;
  }
  else if (icon == 'sidewalk') {
    newStyle = selectSidewalkStyle;
    return newStyle;
  }  
};

const clickSelectedLayer = new Select({
  // condition: click,
  style: selectStyle,
  // multi: true,
});
//***********************************//
//***********************************//

//***********************************//
//              MODIFY               //
//***********************************//
const modify = new Modify({source: vectSource});
map.addInteraction(modify);
//***********************************//
//***********************************//


let draw, snap, iconScale, iconSrc;

function addIcon(size, src, func, type) {
  map.removeInteraction(draw);
  map.removeInteraction(snap);

  iconScale = size;
  iconSrc = src; 

  

  if (func == 'add') {

    const pointIcon = new Style({
      text: new Text({
        // src: iconSrc, // URL of the icon image
        text: String.fromCodePoint(parseInt(iconSrc, 16)),
        font: '900 20px "FontAwesome"',
        scale: iconScale * 12,
    })
      });

    draw = new Draw({
    // source: vectSource,
    type: 'Point',
    style: pointIcon
  });
  }

  else if ((func == 'draw') && (type == 'crosswalk')) {
    draw = new Draw({
    // source: vectSource,
    type: 'LineString',
    style: crosswalkStyle
  });
  }

  else if ((func == 'draw') && (type == 'sidewalk')) {
    draw = new Draw({
    // source: vectSource,
    type: 'LineString',
    style: sidewalkStyle
  });
  }

  map.addInteraction(draw);

  snap = new Snap({source: vectSource});
  map.addInteraction(snap);

  draw.on('drawend', (event) => {
    const feature = event.feature;
    const coordinates = feature.getGeometry().getCoordinates();
    console.log("my coords");
    console.log(coordinates)
    
    let vectFeature, iconGeoJSONFormat, iconGeoJSON;

    if (func == 'add') {
      vectFeature = new Feature({
        geometry: new Point(coordinates),
        feature_type: type,
        src: iconSrc
      });
      
      // // Set the style of the icon feature
      // vectFeature.setStyle(new Style({
      // image: new Icon({
      //   // src: iconSrc, // URL of the icon image
      //   src: image.src,
      //   scale: 0.5 // Set the scale of the icon
      //   })
      // }));

      vectFeature.setStyle(
        // pointIcon
      
        new Style({
        text: new Text({
          // src: iconSrc, // URL of the icon image
          text: String.fromCodePoint(parseInt(iconSrc, 16)),
          font: '900 20px "FontAwesome"',
          scale: iconScale * 12,
    })
        })
      );
    }


    if (func == 'draw') {
      // vectFeature = new Feature({
      // geometry: new LineString(coordinates),
      // feature_type: type,
      // src: 'line'
      // });

      if (type == 'crosswalk') {
        vectFeature = new Feature({
          geometry: new LineString(coordinates),
          feature_type: type,
          src: 'crosswalk'
          });    

          vectFeature.setStyle(crosswalkStyle);
      }

      if (type == 'sidewalk') {
        vectFeature = new Feature({
          geometry: new LineString(coordinates),
          feature_type: type,
          src: 'sidewalk'
          });

          vectFeature.setStyle(sidewalkStyle);
      }
    }
    // Make GeoJSON
    iconGeoJSONFormat = new GeoJSON();
    iconGeoJSON = iconGeoJSONFormat.writeFeatureObject(vectFeature);
    console.log('icongeojson');
    console.log(iconGeoJSON);
    console.log('vectFeature');
    console.log(vectFeature);

    const coords = iconGeoJSON['geometry']['coordinates'];

    const coordType = typeof(coords[0]);
    if (coordType == 'number') {
      iconGeoJSON['geometry']['coordinates'] = convertToGoogleFormat(coords);
      console.log('converted point');
    }

    else if (coordType == 'object') {
      iconGeoJSON['geometry']['coordinates'] = convertArrayToGoogleFormat(coords);
      console.log('converted line');
    }


    geojsonCollection.push(iconGeoJSON)   // adds geojson of added layer to list
    // console.log("yoo")
    // console.log(geojsonCollection, iconGeoJSON);


    // Add the icon feature to the vector source
    vectSource.addFeature(vectFeature);
    layerCollection.push(vectLayer);

    // map.addInteraction(clickSelectedLayer);
    map.addInteraction(clickSelectedLayer);

    

  

    // Remove the Draw interaction after adding the icon
    // draw.setActive(false);
    map.removeInteraction(draw);
    clickSelectedLayer.on('select', function(event){
      const selectedLayer = event.target.getFeatures();
      // const selectedFeatures = event.selected;
      // const deselectedFeatures = event.deselected;
      console.log("MY SELECTION(S)");
      console.log(selectedLayer);
    })
  })
}



// var ooiLayer = new Vector('OOI Layer', { renderers: ["Canvas", "SVG", "VML", "UT8"] });

//***********************************//
//           MOVE LAYER(S)           //
//***********************************//
const translate = new Translate({
  features: clickSelectedLayer.getFeatures(),
});

map.addInteraction(translate);

//***********************************//
//            SAVE MAP               //
//***********************************//

// Gets list of geojson layers and sends to back-end
function saveMap(event) {
  event.preventDefault();
  console.log("ARE YOU SAVING?");

  Swal.fire({
    title: "Save Map Data",
    html: `
      <label for="filename">File Name:</label>
      <input type="text" id="filename" class="swal2-input" value="map_data.geojson" placeholder="Enter file name">
      <br></br>
      <div style="width: 100%; overflow: hidden;">
        <div style="width: 49%; float: left;">
          <input type="checkbox" id="downloadData">
          <label for="downloadData">Download data as a GEOJSON file 
            </label>
        </div>
        <div style="margin-left: 51%;">
          <input type="checkbox" id="shareData" checked>
          <label for="shareData">Share data with development team
		<span class="info-symbol" style="cursor: pointer; color: #007bff;">&#9432;</span>
            	<span class="tooltip-text" style="display: none; position: absolute; background-color: #555; color: #fff; border-radius: 5px; padding: 5px; font-size: 10px; z-index: 1; width: 200px;">Objects placed on the map will be sent to the research team. All data is anonymous and cannot be linked to you. </span>
          </label>
        </div>
      </div>
	<br></br>
    `,
    showCancelButton: true,
    confirmButtonText: "Save",
    preConfirm: () => {
      const fileName = document.getElementById("filename").value.trim();
      const isShared = document.getElementById("shareData").checked;
      const shouldDownload = document.getElementById("downloadData").checked;

      if (!fileName) {
        Swal.showValidationMessage("File name cannot be empty.");
        return false;
      }

      return { fileName, isShared, shouldDownload };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { fileName, isShared, shouldDownload } = result.value;

      const mapData = {
        creation_source: "Website",
        is_shared: isShared ? "True" : "False",
        geojson: {
          type: "FeatureCollection",
          features: geojsonCollection
        }
      };

      console.log("Map Data:", mapData);

      if (isShared) {
        fetch("https://communitydesirelines.uwaterloo.ca/savemap", {
          method: "POST",
          body: JSON.stringify(mapData),
          headers: { "Content-type": "application/json" }
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire("Success!", "Your data has been shared and saved.", "success");
          } else {
            Swal.fire("Error", "There was an issue saving your data.", "error");
          }
        })
        .catch(() => {
          Swal.fire("Error", "Network error while saving data.", "error");
        });
      }

      if (shouldDownload) {
        const blob = new Blob([JSON.stringify(mapData.geojson, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName.endsWith(".geojson") ? fileName : `${fileName}.geojson`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  });


  // Tooltip functionality
  const infoSymbol = document.querySelector(".info-symbol");
  const tooltipText = document.querySelector(".tooltip-text");

  infoSymbol.addEventListener("mouseover", () => {
    tooltipText.style.display = "block";
  });

  infoSymbol.addEventListener("mouseout", () => {
    tooltipText.style.display = "none";
  });
}



// Function to handle dropdown item clicks
function handleDropdownClick(event) {
  event.preventDefault();
  const size = 0.07; // Set a default size or adjust as needed
  const src = event.target.dataset.src; // Get the src from the data attribute
  const fn = event.target.dataset.fn;
  const featureType = event.target.id;
  addIcon(size, src, fn, featureType); // Call addIcon with the size and src
}


// ********************************* //
// COORDINATE REPROJECTION FUNCTIONS //
// ********************************* //
// Function to convert a single coordinate
function convertToGoogleFormat(coord) {
  return transform(coord, 'EPSG:3857', 'EPSG:4326');
}

// Function to convert an array of coordinates
function convertArrayToGoogleFormat(coordsArray) {
  return coordsArray.map(convertToGoogleFormat);
}

// Add event listeners to the dropdown items
// ADD
const addClassIds = [...document.querySelectorAll(".add")].map(el => el.id );
for (let i = 0; i < addClassIds.length; i++) {
  document.getElementById(addClassIds[i]).addEventListener('click', handleDropdownClick);
}

// DRAW
document.getElementById('crosswalk').addEventListener('click', handleDropdownClick); 
document.getElementById('sidewalk').addEventListener('click', handleDropdownClick); 

// FILE
document.getElementById('save').addEventListener('click', saveMap)
// document.getElementById('add').addEventListener('click', testing)
console.log("HI");