export class GpsFilter {
  protected round: number;
  protected prevDataArr: Array<Array<number>>;
  protected predictVal: Array<number>;

  constructor(round: number) {
    this.round = round;
    this.prevDataArr = [];
    this.predictVal = [];
  }

  clearFilter() {
    this.prevDataArr = [];
    this.predictVal = [];
  }

  filterNewData(data: [number, number]) {
    // console.log('=================================', 'data', data);
    // console.log('data', data);
    // console.log("prevDataArr",this.prevDataArr)
    // console.log('predictVal', this.predictVal);

    if (this.prevDataArr.length < 1) {
      this.prevDataArr.push(data);
      return data;
    } else if (this.prevDataArr.length < 2) {
      let gapSum = [0, 0];
      gapSum[0] += data[0] - this.prevDataArr[0][0];
      gapSum[1] += data[1] - this.prevDataArr[0][1];

      const gapAvg = [gapSum[0], gapSum[1]];
      this.predictVal = [data[0] + gapAvg[0], data[1] + gapAvg[1]];
      this.prevDataArr.push(data);
      return data;
    } else {
      //0번은 latitude, 1번은 longitude
      let gapSum = [0, 0];
      for (let i = 0; i < this.prevDataArr.length - 1; i++) {
        gapSum[0] += this.prevDataArr[i + 1][0] - this.prevDataArr[i][0];
        gapSum[1] += this.prevDataArr[i + 1][1] - this.prevDataArr[i][1];
      }

      const gapAvg = [
        gapSum[0] / (this.prevDataArr.length - 1),
        gapSum[1] / (this.prevDataArr.length - 1),
      ];

      const filteredData = [
        (data[0] + this.predictVal[0]) / 2,
        (data[1] + this.predictVal[1]) / 2,
      ];
      if (this.prevDataArr.length > this.round) {
        this.prevDataArr.shift();
      }
      this.prevDataArr.push(filteredData);
      this.predictVal = [data[0] + gapAvg[0], data[1] + gapAvg[1]];

      return filteredData;
    }
  }
}
