import Controller from 'sap/ui/core/mvc/Controller';
import View from 'sap/ui/core/mvc/View';
import UIComponent from 'sap/ui/core/UIComponent';
import Model from 'sap/ui/model/Model';
/**
 * @namespace ui5.typescript.helloworld.controller
 */
export default class Base extends Controller {
  public getRouter() {
    return UIComponent.getRouterFor(this);
  }

  /**
   * Convenience method for getting the view model by name.
   * @public
   * @param {string} [sName] the model name
   * @returns {sap.ui.model.Model} the model instance
   */
  public getModel(sName: string): Model {
    return this.getView().getModel(sName);
  }

  /**
   * Convenience method for setting the view model.
   * @public
   * @param {sap.ui.model.Model} oModel the model instance
   * @param {string} sName the model name
   * @returns {sap.ui.mvc.View} the view instance
   */
  public setModel(oModel: Model, sName: string): View {
    return this.getView().setModel(oModel, sName);
  }
}