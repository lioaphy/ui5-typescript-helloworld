import Device from "sap/ui/Device";
import JSONModel from "sap/ui/model/json/JSONModel";

export default {
  createDeviceModel: function () {
    var oModel = new JSONModel(Device);
    oModel.setDefaultBindingMode("OneWay");
    return oModel;
  }
}