
async function initMap() {
    await ymaps3.ready;

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapMarker} = ymaps3;

      const mapElLfColorful = document.querySelector('.js-ymap-lf-colorful')

      if(mapElLfColorful) {
  
        let zoomMap = 15
        if(isMobile()) {
          zoomMap = 14
        }
  
        const {YMapZoomControl} = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');
  
        const mapElLfColor = new YMap(
          mapElLfColorful,
            {
              location: {
                center: [mapElLfColorful.dataset.longitude, mapElLfColorful.dataset.latitude],
                zoom: zoomMap
              },
            },
            [
              new YMapDefaultFeaturesLayer({})
            ]
        );
    
        var markerElColorful = document.createElement('img')
        markerElColorful.src = mapElLfColorful.dataset.iconSrc
        markerElColorful.className = 'icon-marker-colorful'

        markerColor = new YMapMarker(
          {
            coordinates: ["37.71997475330175", "55.60759741264292"], 
          },
        markerElColorful)

        const url = mapElLfColorful.dataset.action;

        fetch(url)
        .then((res) => {
          return res.json()
        })
        .then((result) => {
            const layer = new YMapDefaultSchemeLayer({
                customization: result
            });
            mapElLfColor.addChild(layer)
        })

        mapElLfColor.setBehaviors(['drag', 'dblClick'])
        mapElLfColor.addChild(
          new YMapControls({position: 'right'})
            .addChild(new YMapZoomControl({}))
        );  
    
        mapElLfColor.addChild(markerColor)
        mapElLfColor.addChild(new YMapDefaultSchemeLayer({}))
      }
}

async function fetchScript() {
  console.log('inside fetchFunc')
  return loadMapScript()
    .then(() => {

    })
}

function loadMapScript() {
  console.log('inside loadMapScript')
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/v3/?apikey=80d825c5-161d-4e34-93fd-4458214443eb&lang=ru_RU';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function setMap() {
  if(document.querySelector('.js-ymap') || document.querySelector('.js-ymap-lf') || document.querySelector('.js-ymap-second') || document.querySelector('.js-ymap-lf-colorful')) {
    fetchScript().then((res) => {
      if (res === 'error') return;
      initMap();
    })
  }
}

setMap()