import CryptoJS from 'crypto-js';
import Ajax from './ajax';
import { createHashHistory } from 'history';
import packageJson from '../../package.json';

const history = createHashHistory();
const { name: microAppName, version: microAppVersion } = packageJson;
/**
 * 全局配置注入window
 *
 * @memberof Store
 */
export const getConfig = async (url?) => {
  try {
    const data = await Ajax.get(url || 'static/config/global.json');
    //全局配置注入window
    window['globalConfig'] = data;
  } catch (error) {}
};

/**
 * 补上不存在的字段 并返回undefined
 * @param {object} obj
 * @param {string} key
 * @returns
 */
export const tryGet = (obj: object, key: string) => {
  return key.split('.').reduce(function (o, x) {
    return typeof o == 'undefined' || o === null ? o : o[x];
  }, obj);
};

// 加密
export const encrypt = (word, keyStr) => {
  keyStr = keyStr || 'uU_ud-a.fgUys@sL';
  var key = CryptoJS.enc.Utf8.parse(keyStr); // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

// 解密
export const decrypt = (word, keyStr) => {
  keyStr = keyStr || 'uU_ud-a.fgUys@sL';
  var key = CryptoJS.enc.Utf8.parse(keyStr); // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  var decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};

/**
 *合并数组单元格
 *
 * @private
 * @memberof TableList
 */
export const formatDataSource = (data, field) => {
  if (!data) {
    return;
  }

  if (!field) {
    return data;
  }

  return data
    .reduce((result, item) => {
      //首先将name字段作为新数组result取出
      if (result.indexOf(item[field]) < 0) {
        result.push(item[field]);
      }
      return result;
    }, [])
    .reduce((result, value) => {
      //将name相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
      const children = data.filter((item) => item[field] === value);
      result = result.concat(
        children.map((item, index) => ({
          ...item,
          rowSpan: index === 0 ? children.length : 0, //将第一行数据添加rowSpan字段
        }))
      );
      return result;
    }, []);
};

//获取分页数据
export const pageData = (res) => {
  if (!res) return;
  return {
    current: res.current_page,
    total: res.total,
    pageSize: res.per_page,
  };
};

/**
 * 获取URL参数
 * @param {*} name
 * @param {*} url
 */
export const getQueryString = (name, url) => {
  if (url && url.indexOf('?') != -1) {
    let str = url.split('?')[1];
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let r = str.match(reg);
    if (r != null) return unescape(r[2]);
  }
  return null;
};

/**
 * 下载文件（数据流）
 */
export const downLoadFile = (data, name, ext?) => {
  try {
    let content = Object.assign(data);
    let link = document.createElement('a');
    link.download = `${name}${ext && `.${ext}`}`;

    // 字符内容转变成blob地址
    let blob = new Blob([content]);
    link.href = URL.createObjectURL(blob);
    link.click();
  } catch (error) {}
};

/**
 * 下载文件（url资源）
 */
export const downLoadUrl = (url, name, ext?) => {
  try {
    let link = document.createElement('a');
    link.download = `${name}${ext && `.${ext}`}`;
    link.href = url;
    link.click();
  } catch (error) {}
};

/**
 * 替换字符串
 * @param {*} s
 * @param {*} n
 */
export const replaceFun = (s, n) => {
  var j = s.substring(s.indexOf(n), n.length);
  return s.replace(j, '');
};

/**
 * 生成唯一guid
 */
export const guid = () => {
  var d = new Date().getTime();
  var _guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return `kmap-${_guid}`;
};

/**
 * 对象深拷贝
 * @param {*} obj
 */
export const copy = (obj) => {
  let newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== 'object') {
    return;
  }

  for (let i in obj) {
    newobj[i] = typeof obj[i] === 'object' ? copy(obj[i]) : obj[i];
  }
  return newobj;
};

/**
 * 获取图标中文
 *
 * @param {*} str
 * @returns
 */
export const getChinese = (str) => {
  try {
    let strs = str.split('-');
    if (strs && strs.length > 0) {
      return strs[0];
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
};

/**
 * 获取图标英文
 *
 * @param {*} str
 * @returns
 */
export const getEnglish = (str) => {
  try {
    let strs = str.split('-');
    if (strs && strs.length > 1) {
      return str.replace(`${strs[0]}-`, '');
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
};

/**
 * 验证是否是管理员角色
 *
 * @returns
 */
export const verifyAdmin = () => {
  try {
    const role = decrypt(localStorage.getItem(`geo-power`), 'uU_ud-a.fgUys@sL');

    if (role === 'ICON_ADMIN' || role === 'SUPER_ADMIN') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

/**
 * 获取base64图片
 *
 * @returns
 */
export const getBase64 = (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  } catch (error) {}
};

/**
 * 文件转成为字符串
 *
 * @returns
 */
export const fileString = (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  } catch (error) {}
};

/**
 * 根据每行元素所占高度获取首屏加载的数量
 *
 * @returns
 */
export const getPageSize = (topHeight, singleHeight, rowCount) => {
  try {
    //实际内容高度
    const height = document.documentElement.clientHeight - topHeight;

    //首屏多少行
    const number = Math.ceil(height / singleHeight);

    //首屏真实数量
    return number * parseInt(rowCount);
  } catch (error) {}
};

/**
 * 输入字符验证
 *
 * @returns
 */
export const inputValidator = (rule, value, callback) => {
  try {
    if (value && !/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/g.test(value)) {
      callback('请输入中文、英文、数字或下划线组合！');
    }

    // 必须总是返回一个callback，否则 validateFields 无法响应
    callback();
  } catch (error) {
    callback();
  }
};

/**
 * 图标中文字符验证
 *
 * @returns
 */
export const chineseValidator = (value) => {
  try {
    if (value && !/^[\u4e00-\u9fa5a-zA-Z0-9]+$/g.test(value)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 图标英文字符验证
 *
 * @returns
 */
export const englishValidator = (value) => {
  try {
    if (value && !/^[a-zA-Z0-9]+$/g.test(value)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 获取字符串长度（区别中英文）
 *
 * @returns
 */
export const getLen = (str) => {
  try {
    let len = 0;
    for (let i = 0; i < tryGet(str, 'length'); i++) {
      if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
        len += 2;
      } else {
        len++;
      }
    }
    return len;
  } catch (error) {
    return tryGet(str, 'length');
  }
};

/**
 * 返回指定长度字符串
 *
 * @returns
 */
export const subStr = (str, len) => {
  try {
    let str_length = 0;
    let str_len = 0;
    let str_cut = '';
    str_len = str.length;
    for (let i = 0; i < str_len; i++) {
      let a = str.charAt(i);
      str_length++;
      if (escape(a).length > 4) {
        //中文字符的长度经编码之后大于4
        str_length++;
      }
      str_cut = str_cut.concat(a);
      if (str_length >= len) {
        str_cut = str_cut.concat('...');
        return str_cut;
      }
    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length < len) {
      return str;
    }
  } catch (error) {
    return str;
  }
};

/**
 * 根据指定宽度截取字符串（会影响性能）
 * @param desc 原始字符串
 * @param width 该显示的宽度
 * @param fontsize 字体大小  12px
 * @returns {string} 截取后的字符串
 */
export const getStrByWith = (
  desc,
  width,
  fontsize,
  fontFamily?,
  letterSpacing?
) => {
  try {
    let span = document.createElement('span');
    span.id = 'cut';
    span.style.visibility = 'hidden';
    span.style.fontSize = fontsize;
    span.style.fontFamily = fontFamily || 'PingFangSC-Regular';
    span.style.letterSpacing = letterSpacing || '0';
    span.style.whiteSpace = 'normal';
    let boo = false;
    let temp = ''; // 存放截断字符串
    for (let j = 0; j < desc.length; j++) {
      // desc是目标字符串，
      temp += desc[j];
      span.innerText = temp + '...';
      if (span.offsetWidth > width) {
        boo = true;
        temp = temp.replace(desc[j], '');
        break;
      }
    }
    if (boo) temp += '...';
    return temp;
  } catch (error) {
    return desc;
  }
};

/**
 * 判断是否为纯色
 *
 * @returns
 */
export const judgePurity = (color) => {
  try {
    return color === 'rgb(255,255,255)' ? true : false;
  } catch (error) {
    return false;
  }
};

/**
 * 数组深拷贝（b的值复制给a）
 *
 * @returns
 */
export const extend = (a, b) => {
  try {
    for (let key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  } catch (error) {
    return a;
  }
};

/**
 * 动态引入script
 *
 * @returns
 */
export const loadJS = (url, callback) => {
  try {
    let script: any = document.createElement('script'),
      fn = callback || function () {};
    script.type = 'text/javascript';
    //IE
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (
          script.readyState === 'loaded' ||
          script.readyState === 'complete'
        ) {
          script.onreadystatechange = null;
          fn();
        }
      };
    } else {
      //其他浏览器
      script.onload = function () {
        fn();
      };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  } catch (error) {}
};

/**
 * antd提供的获取需要展开父节点的方法
 * @param key
 * @param tree
 */
export const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (
        node.children.some((item) => {
          return item.key === key;
        })
      ) {
        parentKey = node.key;
      } else {
        const keyFind = getParentKey(key, node.children);
        if (keyFind) parentKey = keyFind;
      }
    }
  }
  return parentKey;
};

/**
 * 生成扁平化的节点数组
 * @param data
 * @param arrayToChange
 */
export const generateList = (data, arrayToChange) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, title } = node;
    arrayToChange.push({ key, title });
    if (node.children) {
      generateList(node.children, arrayToChange);
    }
  }
};

const createAssociationTreeOption = {
  searchField: 'title', // 需要匹配搜索内容的字段
  childrenField: 'children', // 需要搜索的子级字段
};

/**
 * 根据搜索内容删除不匹配的子节点
 * @params sourceTree 需要过滤的树信息  searchContent 搜索内容 options 搜索选项
 */
const filterUsefulChildren = (origin, searchContent, options) => {
  const { searchField, childrenField } = options;
  const searchList = origin[childrenField];
  const usefulChildren = [];
  searchList.forEach((node) => {
    const { [searchField]: nodeContent, [childrenField]: children } = node;
    if (children && children.length)
      filterUsefulChildren(node, searchContent, options);
    if (
      (nodeContent && nodeContent.indexOf(searchContent) > -1) ||
      node[childrenField]
    )
      usefulChildren.push(node);
  });
  if (usefulChildren.length) {
    origin[childrenField] = usefulChildren;
  } else delete origin[childrenField];
};

/**
 * 根据搜索内容生成相关树
 * @params sourceTree 需要过滤的树信息 searchContent 搜索内容 options 搜索选项
 */
export const createAssociationTree = (
  sourceTree,
  searchContent,
  options = createAssociationTreeOption
) => {
  const sourceTreeCloned = JSON.parse(JSON.stringify(sourceTree));
  const { childrenField } = options;
  let result = [];
  if (sourceTree && sourceTree.length) {
    const origin = { [childrenField]: sourceTreeCloned };
    filterUsefulChildren(origin, searchContent, options);
    if (origin[childrenField]) result = origin[childrenField];
  }
  return result;
};

/**
 * 打印错误信息
 */
export const dealError = (error) => {
  console.log(`出现异常信息:${error}`);
};

/**
 * 设置路由地址
 */
export const microAppHistory = {
  push(url) {
    return history.push(`${routeBaseName}${url}`);
  },
  replace(url) {
    return history.replace(`${routeBaseName}${url}`);
  },
};
