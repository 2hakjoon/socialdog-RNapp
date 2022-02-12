import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';

export type AuthStackList = {
  AuthSelect:undefined
  Login: {email: string | undefined ,password: string | undefined};
  Join: undefined
}


export type RootStackList = {
  Auth: undefined;
  Record: undefined
  WalkRecords: undefined
  Walk: undefined
  Profile: undefined
  Social: undefined
};

export type RootTabNavigator = {
  WalkTab: undefined
  ProfileTab: undefined
  SocialTab: undefined
}

export type UseNavigationProp<TabName extends keyof RootTabNavigator> = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabNavigator, TabName>,
  StackNavigationProp<RootStackList>
>;


export type RootRouteProps<RouteName extends keyof RootStackList> = RouteProp<
RootStackList,
RouteName
>;

export type AuthNavigationProp= StackNavigationProp<AuthStackList>

export  type AuthRoutProp<RouteName extends keyof AuthStackList> = RouteProp<AuthStackList, RouteName>
