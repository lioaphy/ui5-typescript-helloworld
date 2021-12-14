import ClientModel from "sap/ui/model/ClientModel";
import MetaModel from "sap/ui/model/MetaModel";



export default class GraphqlModel extends ClientModel {
  getMetaModel() {
    return new MetaModel()
  }
}