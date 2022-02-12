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
  Profile: undefined
  Social: undefined
  Weather: undefined
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;
