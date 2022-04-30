type data = {
  [k: string]: any;
};

type inputData = {
  key: string;
  value: any;
};

class GlobalStore {
  constructor(public data: data = {}) {}
  getData(key: string) {
    console.log(this.data);
    return this.data[`${key}`];
  }
  setData({key, value}: inputData) {
    this.data[`${key}`] = value;
  }
}

export let gAccessToken = '';

export const globalStore = new GlobalStore({});
