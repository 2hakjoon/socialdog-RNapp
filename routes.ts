import { RouteProp } from "@react-navigation/native";


export const routes = {
  Auth: 'Auth',
  AuthSelect : 'AuthSelect',
  Login: 'Login',
  Join:'Join',
  record: 'record',
  walkRecords: 'walkRecords',
  Profile: 'Profile',
  Social: 'Social',
  Weather: 'Weather',
};

export type RootStackParamList = {
  Auth: undefined;
  AuthSelect: undefined;
  Login: {email:string,password:string};
  Join: undefined
  Record: undefined
  WalkRecord: undefined
  Weather: undefined
  Profile: undefined
  Social: undefined
};

export type RootTabNavigator = {
  WeatherTab: undefined
  ProfileTab: undefined
  SocialTab: undefined
}


export type RootRouteProps<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;
