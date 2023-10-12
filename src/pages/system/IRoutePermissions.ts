import React from "react";
import { RouteProps } from "react-router-dom";



export interface IRoutePermission {
    route: string;
    component:
      | React.ComponentType<RouteProps>
      | React.ComponentType<any>;
  }