# 소셜독 어플리케이션
![KakaoTalk_Photo_2022-02-26-18-39-16 001 (1)](https://user-images.githubusercontent.com/61589338/177762295-fccfefd1-f17e-4c54-b9a9-12c6162b7228.png)   
지역기반의 반려동물 커뮤니티 소셜독의 어플리케이션 입니다.  
React Native로 구현하였으며, 상태관리는 Apollo Client를 사용하였습니다.

## 기술 스택
 * Typescript
 * React Native
 * Apollo Client
 
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