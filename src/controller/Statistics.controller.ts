import Control from "sap/ui/core/Control";
import Controller from "sap/ui/core/mvc/Controller";
import View from "sap/ui/core/mvc/View";
import XMLView from "sap/ui/core/mvc/XMLView";
import JSONModel from "sap/ui/model/json/JSONModel";
import VersionInfo from "sap/ui/VersionInfo";

/**
 * @namespace ui5.typescript.helloworld.controller
 */
export default class Statistics extends Controller {

  onInit() {
    var oViewModel = new JSONModel({
      ColumnChartData: [{ v: 80 }, { v: 150 }, { v: 400 }, { v: 200 }],
      ColumnChartData2: [{ v: 40 }, { v: 320 }, { v: 270 }, { v: 140 }, { v: 60 }],
      ComparisonChartData: [{ v: 120 }, { v: -67 }, { v: 250 }, { v: -80 }],
      ComparisonChartData2: [{ v: -70 }, { v: 170 }, { v: -30 }, { v: 60 }, { v: 120 }],
      PieChartData: [{ v: 83 }],
      PieChartData2: [{ v: 57 }]
    });
    this.getView().setModel(oViewModel, "view");

    // Load charts for the current environment (D3 = OpenUI5, MicroCharts = SAPUI5)
    VersionInfo.load({ library: "sap.ui.core" }).then((oVersionInfo) => {
      var sType = (oVersionInfo.name.startsWith("SAPUI5") ? "Micro" : "D3");

      if (sType === "Micro") {
        // For SAPUI5, we need first to load the microchart library and then create the view
        sap.ui.getCore().loadLibrary("sap.suite.ui.microchart", { async: true }).then(() => {
          this._createView(sType);
        });
      } else {
        this._createView(sType);
      }
    });
  }

  onRefresh() {
    var view = this.byId("charts") as View;
    var statisticsBlockLayout = view.byId("statisticsBlockLayout") as Control;
    statisticsBlockLayout.invalidate();
    statisticsBlockLayout.setBusy(true);
    setTimeout(() => {
      statisticsBlockLayout.setBusy(false);
    }, 2000);
  }

  _createView(sType: string) {
    XMLView.create({
      id: this.getView().createId("charts"),
      viewName: "ui5.typescript.helloworld.view.Statistics" + sType
    }).then((oView) => {
      (this.byId("statisticsContainer") as View).addContent(oView);
    });
  };

}