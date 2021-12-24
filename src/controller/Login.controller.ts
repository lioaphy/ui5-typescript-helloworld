import { gql } from "@apollo/client/core";
import BindingMode from "sap/ui/model/BindingMode";
import JSONModel from "sap/ui/model/json/JSONModel";
// @ts-ignore
import BindingParser from "sap/ui/base/BindingParser";
import History from "sap/ui/core/routing/History";
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace ui5.typescript.helloworld.controller.inspection
 */
export default class Login extends Controller {

  public onInit(): void {
    var model = new JSONModel();
    model.setDefaultBindingMode(BindingMode.OneWay);
    this.getView().setModel(model);
    var oRouter = UIComponent.getRouterFor(this);
    oRouter.getRoute("login").attachMatched(this._onRouteMatched, this);
  }

  _onRouteMatched(oEvent: any) {
    var oArgs = oEvent.getParameter("arguments");
    var oView = this.getView();
    var oModel = oView.getParent().getModel() as JSONModel;
    console.log(oModel);
    oModel.setProperty('visible', false)

  }
}