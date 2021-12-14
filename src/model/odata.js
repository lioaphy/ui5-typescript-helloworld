sap.ui.define(["sap/ui/model/odata/v4/ODataModel"], function (ODataModel) {
  var oModel = new ODataModel({
      serviceUrl : "/sap/opu/odata4/IWBEP/V4_SAMPLE/default/IWBEP/V4_GW_SAMPLE_BASIC/0001/",
      synchronizationMode : "None"
  });
});