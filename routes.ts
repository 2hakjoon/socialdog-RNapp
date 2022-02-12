import { RouteProp } from "@react-navigation/native";


const login = 'login'
export const routes = {
  auth: 'auth',
  login: login,
  join:'join',
  record: 'record',
  walkRecords: 'walkRecords',
  profile: 'profile',
  social: 'social',
  weather: 'weather',
};

export type RootStackParamList = {
  login: {email:string,password:string};
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;
