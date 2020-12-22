import { observable, runInAction } from "mobx";

class GlobalState {
  @observable state = {};               // 初始全局状态

  /**
   *
   * @param key 需要获取的状态键名，不传则获取完整的状态
   */
  private get = (key?: string) => {
    if (key) return this.state[key];
    return this.state;
  };

  /**
   *
   * @param newState 需要更新的状态，参数必须为一个对象，否则不生效
   */
  private set = (newState) => {
    if (typeof newState === 'object') {
      runInAction(() => {
        this.state = {
          ...this.state,
          ...newState
        };
      })
    }
  }
}

let isSetState = false;
let globalState;
if (!isSetState) {
  globalState = new GlobalState();
  isSetState = true;
}

interface globalStateProps {
  state: any;
  get: any;
  set: any;
}

export const get = globalState.get;
export const set = globalState.set;
export const coverGlobalState = (newGlobalState: globalStateProps) => {
  Object.entries(newGlobalState).map(item => {
    const [key, value] = item;
    globalState[key] = value;
  });
};
export default globalState;

