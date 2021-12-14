import GraphqlModel from "../lib/GraphqlModel";


export default class ItemService {

  get() {
    var model = new GraphqlModel();
    var meta = model.getMetaModel();
    
  }
}