export default class Ajax {
  static get(url): any {
    return new Promise((resolve) => {
      // XMLHttpRequest对象用于在后台与服务器交换数据
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onreadystatechange = () => {
        // readyState == 4说明请求已完成
        if (
          (xhr.readyState === 4 && xhr.status === 200) ||
          xhr.status === 304
        ) {
          // 从服务器获得数据
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            //debugger
            resolve(xhr.responseText);
          }
        }
      };
      xhr.send();
    });
  }

  // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
  static post(url, data): any {
    return new Promise((resolve) => {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      // 添加http头，发送信息至服务器时内容编码类型
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = () => {
        if (
          xhr.readyState === 4 &&
          (xhr.status === 200 || xhr.status === 304)
        ) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            resolve(xhr.responseText);
          }
        }
      };
      xhr.send(data);
    });
  }
}
