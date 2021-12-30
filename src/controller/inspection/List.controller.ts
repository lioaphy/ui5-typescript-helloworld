import { gql } from "@apollo/client/core";
import BindingMode from "sap/ui/model/BindingMode";
import JSONModel from "sap/ui/model/json/JSONModel";
import ObjectListItem from "sap/m/ObjectListItem";
import BaseController from "../../component/Base.controller";
// @ts-ignore
import BindingParser from "sap/ui/base/BindingParser";

const GET_SIP = gql(`
  query{
  InspectSIPPagination{
    items{
      _id
      sip_id
      sampling_plan
      inspection_level
      acceptable_quality_level
      part_number
      item_description
      createdAt
      created_by
    }
    count
    pageInfo{
      perPage
      pageCount
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
}
`);

/**
 * @namespace ui5.typescript.helloworld.controller.inspection
 */
export default class List extends BaseController {

  public onInit(): void {
    super.onInit();

    const model = new JSONModel();
    model.setDefaultBindingMode(BindingMode.OneWay);
    this.getView().setModel(model);

    this.$query({ query: GET_SIP }).then((result) => {
      const binding = BindingParser.complexParser("{/sip}");
      if (binding) {
        const modelName = binding.model;
        const path = binding.path || `/sip`; // defaults to entity
        const value = result.data.InspectSIPPagination.items;
        const model = this.getView().getModel(modelName) as JSONModel;
        model.setProperty(path, value);
      }
    }).catch(reason => {
      console.log(reason)
    })
  }

  public onPress(oEvent: any) {
    var oListItem = oEvent.getSource() as ObjectListItem;
    var oItem = oListItem.getBindingContext().getObject() as any;
    this.getRouter().navTo("sipDetail", { sipId: oItem._id })
  }
}