import BindingMode from "sap/ui/model/BindingMode";
import JSONModel from "sap/ui/model/json/JSONModel";
import Controller from "sap/ui/core/mvc/Controller";

/**
 * @namespace ui5.typescript.helloworld.controller.inspection
 */
export default class Login extends Controller {

  public onInit(): void {
    var model = new JSONModel();
    model.setDefaultBindingMode(BindingMode.OneWay);
    this.getView().setModel(model);
  }
}