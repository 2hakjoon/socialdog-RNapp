import React from 'react';
import {StyleSheet, View} from 'react-native';
import TextComp from '../../components/TextComp';

interface IAqiComponent {
  pm2_5: number;
  pm10: number;
}

const GOOD = '좋음';
const MORDERATE = '보통';
const BAD = '나쁨';
const VERYBAD = '매우나쁨';

function AqiComponent({pm2_5, pm10}: IAqiComponent) {
  const pm2_5Level = (pm2_5: number) => {
    if (pm2_5 < 0) {
      return '알수없음';
    } else if (pm2_5 < 15) {
      return GOOD;
    } else if (pm2_5 > 16 && pm2_5 < 35) {
      return MORDERATE;
    } else if (pm2_5 > 36 && pm2_5 < 75) {
      return BAD;
    } else {
      return VERYBAD;
    }
  };

  const pm10Level = (pm10: number) => {
    if (pm10 < 0) {
      return '알수없음';
    } else if (pm10 < 30) {
      return GOOD;
    } else if (pm10 > 31 && pm10 < 80) {
      return MORDERATE;
    } else if (pm10 > 81 && pm10 < 150) {
      return BAD;
    } else {
      return VERYBAD;
    }
  };

  return (
    <View style={styles.outerWrapper}>
      <TextComp text={'미세먼지'} size={20} />
      <View style={styles.wrapper}>
        <View style={styles.block}>
          <TextComp text={'pm10'} />
          <TextComp text={pm10Level(pm10)} size={30} />
          <TextComp text={`pm10 : ${pm10}㎍/㎥`} />
        </View>
        <View style={styles.block}>
          <TextComp text={'pm2.5'} />
          <TextComp text={pm2_5Level(pm2_5)} size={30} />
          <TextComp text={`${pm2_5}㎍/㎥`} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
    height: '25%',
    paddingBottom: 30,
  },
  wrapper: {
    paddingTop: 10,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  block: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '50%',
  },
});

export default AqiComponent;
