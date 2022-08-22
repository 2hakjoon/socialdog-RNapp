# 소셜독 어플리케이션
![KakaoTalk_Photo_2022-02-26-18-39-16 001 (1)](https://user-images.githubusercontent.com/61589338/177762295-fccfefd1-f17e-4c54-b9a9-12c6162b7228.png)      
지역기반의 반려동물 커뮤니티 소셜독의 어플리케이션 입니다.     
산책기록 기능을 구현하기 위해 React Native로 제작하였습니다.   
커뮤니티 탭에서, 웹앱으로 구현된 소셜독 서비스를 이용할 수 있습니다.  
플레이스토어에 배포되어 현재 다운로드 할 수 있습니다.  
App 다운로드(안드로이드) : https://play.google.com/store/apps/details?id=com.socialdog    
Code Push를 적용하여, 배포주기를 짧게 관리할 수 있습니다.


## 기술 스택
 * Typescript
 * React Native
 * Apollo Client
 * Code Push

## 산책 기록기능 데모 영상
[![Video Label](http://img.youtube.com/vi/lpWQvNLFCIo/0.jpg)](https://youtu.be/lpWQvNLFCIo)
클릭시 유튜브로 이동.


## 미리보기
### 로그인 화면
![image](https://user-images.githubusercontent.com/61589338/185923431-8f568f54-d500-4f81-9c3d-1202c94b661e.png){: width="300"}{: .center}
### 반려견 프로필 저장
![image](https://user-images.githubusercontent.com/61589338/185923471-56d4b46c-8c18-4393-80dd-bc3232e85aec.png){: width="300"}{: .center}
### 산책 기록
![image](https://user-images.githubusercontent.com/61589338/185923521-6710536a-f9c9-4980-a774-489d242c8c1c.png){: width="300"}{: .center}
### 산책 기록 확인
![image](https://user-images.githubusercontent.com/61589338/185923578-13bf169f-6e2b-4b7b-9158-6597491b22fd.png){: width="300"}{: .center}
### 웹앱으로 구현된 소셜독 커뮤니티
![image](https://user-images.githubusercontent.com/61589338/185923650-328ca851-0ffe-43b1-a7e0-d083603861f0.png){: width="300"}{: .center}


## 기능 구현
 - 로그인 관련  
 JWT Token으로 사용자 인증  
 Apollo Client의 Error Handling기능으로 토큰만료시, 자동 갱신

 - 반려동물 프로필 저장
 반려동물의 이름 및 사진을 저장.

 - 날씨 정보
 현재 위치의 날씨정보를 표시.

 - 반려동물 산책 기록    
 사용자의 위치정보를 5m단위로 기록하며, 산책경로를 저장, 조회가능.  
 잠금화면, 다른 앱 전환시, 산책기록이 끊기지 않게 동작.  
 지도상에 산책경로 PolyLine으로 그림.  
 화면에 보여질 산책경로의 크기를 계산해서, 지도의 zoom-level조정하여 한눈에 산책 경로가 보이게 함.
  
 - 커뮤니티 기능  
 react로 구현된 커뮤니티 웹 페이지를 웹뷰로 보여줌.