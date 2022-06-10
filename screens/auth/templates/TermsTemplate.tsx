import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import WebView from 'react-native-webview';
import {colors} from '../../../utils/colors';
import BasicButton from '../../components/BasicButton';
import MaterialCommunityIcons from '../../components/Icons/MaterialCommunityIcons';
import ModalBackground from '../../components/modal/ModalBackground';
import ModalRoundBox from '../../components/modal/ModalRoundBox';
import TextComp from '../../components/TextComp';

interface ITermsTemplate {
  closeModal: () => void;
}

const termHTMLStyle = `<style>
body { font-size: 180%; word-wrap: break-word; overflow-wrap: break-word; }
</style>`;

function TermsTemplate({closeModal}: ITermsTemplate) {
  const [termsOfPrivacy, setTermsOfPrivacy] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptService, setAcceptService] = useState(false);

  const getTermsOfPrivacy = async () => {
    const res = await fetch(
      'https://socialdog.s3.ap-northeast-2.amazonaws.com/Terms/termsofprivacy.txt',
    );
    let reader = new FileReader();
    reader.onload = async function () {
      setTermsOfPrivacy(termHTMLStyle + reader.result);
    };
    reader.readAsText(await res.blob());
    //setTermsOfPrivacy(res.data);
  };

  const toggleAccectPrivacy = () => {
    setAcceptPrivacy(prev => !prev);
  };
  const toggleAccectService = () => {
    setAcceptService(prev => !prev);
  };

  useEffect(() => {
    getTermsOfPrivacy();
  }, []);

  return (
    <ModalBackground closeModal={closeModal}>
      <ModalRoundBox title="약관동의" closeModal={closeModal}>
        <View style={styles.contentWrapper}>
          <View style={styles.labelWrapper}>
            <TextComp text="개인정보 처리 방침" size={16} />
            <TouchableOpacity
              onPress={toggleAccectPrivacy}
              style={styles.checkboxWrapper}>
              <TextComp text="동의합니다" size={14} />
              {acceptPrivacy ? (
                <MaterialCommunityIcons
                  size={14}
                  name="checkbox-marked-outline"
                />
              ) : (
                <MaterialCommunityIcons
                  size={14}
                  name="checkbox-blank-outline"
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.termBox}>
            <WebView
              source={{
                html: '' + termsOfPrivacy,
              }}
            />
          </View>
          <View style={styles.labelWrapper}>
            <TextComp text="개인정보 처리 방침" size={16} />
            <TouchableOpacity
              onPress={toggleAccectService}
              style={styles.checkboxWrapper}>
              <TextComp text="동의합니다" size={14} />
              {acceptPrivacy ? (
                <MaterialCommunityIcons
                  size={14}
                  name="checkbox-marked-outline"
                />
              ) : (
                <MaterialCommunityIcons
                  size={14}
                  name="checkbox-blank-outline"
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.termBox}>
            <WebView
              source={{
                html: '' + termsOfPrivacy,
              }}
            />
          </View>
          <BasicButton title="동의 완료" onPress={() => {}} />
        </View>
      </ModalRoundBox>
    </ModalBackground>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    width: '100%',
    height: '100%',
    padding: 14,
  },
  termBox: {
    width: '100%',
    flex: 1,
    padding: 6,
    borderWidth: 2,
    borderColor: colors.PDarkGray,
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'scroll',
    marginBottom: 20,
  },
  labelWrapper: {
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 6,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

export default TermsTemplate;
