import { gql } from "@apollo/client/core";
import BindingMode from "sap/ui/model/BindingMode";
import JSONModel from "sap/ui/model/json/JSONModel";
// @ts-ignore
import BindingParser from "sap/ui/base/BindingParser";
import BaseController from "../../component/Base.controller";

const GET_SIP = gql(`
  query{
  InspectSIPPagination{
    items{
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
      console.log(result);

      const binding = BindingParser.complexParser("{/sip}");
      if (binding) {
        const modelName = binding.model;
        const path = binding.path || `/sip`; // defaults to entity
        const value = result.data?.InspectSIPPagination?.items || [];
        const model = this.getView().getModel(modelName) as JSONModel;
        model.setProperty(path, value);
      }
    }).catch(reason => {

      console.log(reason)
    })

  }

}