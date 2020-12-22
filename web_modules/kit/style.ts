import { Ajax, copy } from 'kit';

/**
 * 获取配置
 * @param {*} style
 * @param {*} roadname
 * @param {*} type
 * @param {*} callback
 */
export const getStyle = (style, roadname, type, callback) => {
  let configUrl = './static/style/';
  if (type === 1) {
    configUrl = configUrl + 'st.json';
  } else if (type === 2) {
    configUrl = configUrl + 'kd.json';
  }

  Ajax.get(configUrl).then((res) => {
    if (res) {
      let result = res.layers.filter((e) => {
        return e.name === roadname;
      })[0];

      if (result) {
        if (type === 1) {
          getGtLayers(style.layers, result.ids, callback);
        } else if (type === 2) {
          getKdLayers(style.layers, result.ids, callback);
        }
      }
    }
  });
};

/**
 * 获取配置（批量）
 * @param {*} style
 * @param {*} roadname
 * @param {*} type
 * @param {*} callback
 */
export const getStyles = (style, roads, type, callback) => {
  let configUrl = './static/style/';
  if (type === 1) {
    configUrl = configUrl + 'st.json';
  } else if (type === 2) {
    configUrl = configUrl + 'kd.json';
  }

  Ajax.get(configUrl).then((res) => {
    if (res) {
      //定义变量数据
      let styleLayers = [];
      roads.forEach((road) => {
        let result = res.layers.filter((e) => {
          return e.name === road.value;
        })[0];

        if (result) {
          if (type === 1) {
            getGtLayers(style.layers, result.ids, (layers) => {
              styleLayers.push({
                roadTypeName: road.value,
                layers: layers,
              });
            });
          } else if (type === 2) {
            getKdLayers(style.layers, result.ids, (layers) => {
              styleLayers.push({
                roadTypeName: road.value,
                layers: layers,
              });
            });
          }
        }
      });

      callback(styleLayers);
    }
  });
};

/**
 * 获取世纪高通样式图层
 * @param {*} layers
 * @param {*} ids
 * @param {*} callback
 */
const getGtLayers = (layers, ids, callback) => {
  let results = [];
  if (layers && ids) {
    ids.forEach((id) => {
      let layer = layers.filter((e) => {
        return e.layerInfo.name === id;
      })[0];
      if (layer) {
        let layercopy: any = copy(layer);
        layercopy.layerInfo.name = layer.layerInfo.name + '-copy';
        layercopy.id = layer.id + '-copy';
        layercopy.source = 'road';
        if (layercopy.type === 'symbol') {
          layercopy.layout['text-field'] = ['to-string', ['get', 'name']];
        }

        delete layercopy['source-layer'];
        delete layercopy.filter;
        results.push(layercopy);
      }
    });
  }

  callback(results);
};

/**
 * 获取科达地图样式图层
 * @param {*} layers
 * @param {*} ids
 * @param {*} callback
 */
const getKdLayers = (layers, ids, callback) => {
  var results = [];
  if (layers && ids) {
    ids.forEach((id) => {
      var layer = layers.filter(function (e) {
        return e.id === id;
      })[0];
      if (layer) {
        var layercopy: any = copy(layer);
        layercopy.id = layer.id + '-copy';
        layercopy.source = 'road';
        if (layercopy.type === 'symbol') {
          layercopy.layout['text-field'] = ['to-string', ['get', 'name']];
        }

        delete layercopy['source-layer'];
        delete layercopy.filter;
        results.push(layercopy);
      }
    });
  }

  callback(results);
};
