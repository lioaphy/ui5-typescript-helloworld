import Controller from "sap/ui/core/mvc/Controller";
import * as Device from "sap/ui/Device";
import JSONModel from "sap/ui/model/json/JSONModel";
import formatter from '../model/formatter';

/**
 * @namespace ui5.typescript.helloworld.controller
 */
export default class Home extends Controller {
  formatter = formatter

  onInit() {
    var oViewModel = new JSONModel({
      isPhone: Device.system.phone
    });
    this.getView().setModel(oViewModel, "view");

    Device.media.attachHandler((oDevice: any) => {
      var model = this.getView().getModel("view") as JSONModel;
      model.setProperty("/isPhone", oDevice.name === "Phone");
    });
  }
}