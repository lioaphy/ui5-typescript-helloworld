import BindingMode from "sap/ui/model/BindingMode";
import JSONModel from "sap/ui/model/json/JSONModel";
import Input from "sap/m/Input";
import { gql } from "@apollo/client/core";
import BaseController from "../component/Base.controller";
import MessageToast from "sap/m/MessageToast";

const LOGIN = gql`
  mutation login($username: String!, $password: String!, $org_id: Int!) { 
  LogIn(username: $username, password: $password, org_id: $org_id) {
    username
  }
}
`;

/**
 * @namespace ui5.typescript.helloworld.controller
 */
export default class Login extends BaseController {

  public onInit(): void {
    super.onInit();

    var model = new JSONModel();
    model.setDefaultBindingMode(BindingMode.OneWay);
    this.getView().setModel(model);
    console.log(this)
  }

  onLoginTap(oEvent: any) {
    console.log(this)
    var username = (this.byId('uid') as Input).getValue();
    var password = (this.byId('pasw') as Input).getValue();

    this.$mutate({ mutation: LOGIN, variables: { username, password, org_id: 385 } }).then(() => {
      this.getRouter().navTo('home');
    }).catch((e) => {
      MessageToast.show(e.message)
    })
  }
}