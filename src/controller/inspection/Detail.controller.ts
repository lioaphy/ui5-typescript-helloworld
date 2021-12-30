import { gql } from "@apollo/client/core";
import BindingMode from "sap/ui/model/BindingMode";
import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "../../component/Base.controller";
import History from "sap/ui/core/routing/History";
// @ts-ignore
import BindingParser from "sap/ui/base/BindingParser";

const GET_SIP = gql(`
query InspectSIPFindById($_id: MongoID!) {
  InspectSIPFindById(_id: $_id) {
    _id
    sip_id
    site
    status
    release_date
    revision
    revision_description
  
    sampling_plan
    inspection_level
    acceptable_quality_level
  
    producer
    process
    process_description
  
    part_number
    item_description
    
    dimension_pic
    dimension_inspection
    other_pic
    other_inspection
  
    pages{
      pic
      dimension_inspection
      other_inspection
    }
  
    createdAt
    updatedAt
    created_by
    updated_by
  }
}
`);

/**
 * @namespace ui5.typescript.helloworld.controller.inspection
 */
export default class Detail extends BaseController {

  public onInit(): void {
    super.onInit();

    var model = new JSONModel();
    model.setDefaultBindingMode(BindingMode.OneWay);
    this.getView().setModel(model);
    var oRouter = this.getRouter();
    oRouter.getRoute("sipDetail").attachMatched(this._onRouteMatched, this);
  }

  onNavBack() {
    var oHistory = History.getInstance();
    var sPreviousHash = oHistory.getPreviousHash();

    if (sPreviousHash !== undefined) {
      window.history.go(-1);
    } else {
      var oRouter = this.getRouter();
      oRouter.navTo("sip", {}, {}, true);
    }
  }

  _onRouteMatched(oEvent: any) {
    var oArgs = oEvent.getParameter("arguments");
    var oView = this.getView();

    this.$query({ query: GET_SIP, variables: { _id: oArgs.sipId } }).then((result) => {

      const binding = BindingParser.complexParser("{/data}");
      if (binding) {
        const modelName = binding.model;
        const path = binding.path || `/data`; // defaults to entity
        const value = result.data.InspectSIPFindById;
        const model = oView.getModel(modelName) as JSONModel;
        model.setProperty(path, value);
      }
    }).catch(reason => {
      console.log(reason)
    })
  }
}