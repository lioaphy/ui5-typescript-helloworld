
import MessageToast from "sap/m/MessageToast";
import NotificationListItem from "sap/m/NotificationListItem";
import CustomData from "sap/ui/core/CustomData";
import syncStyleClass from "sap/ui/core/syncStyleClass";
import * as Device from "sap/ui/Device";
import Event from "sap/ui/base/Event";
import Button from "sap/m/Button";
import ActionSheet from "sap/m/ActionSheet";
import { ButtonType, PlacementType, VerticalPlacementType } from "sap/m/library";
import MessagePopover from "sap/m/MessagePopover";
import ResponsivePopover from "sap/m/ResponsivePopover";
import Context from "sap/ui/model/Context";
import Link from "sap/m/Link";
import MessagePopoverItem from "sap/m/MessagePopoverItem";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Popup from "sap/ui/core/Popup";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ToolPage from "sap/tnt/ToolPage";
import UI5Element from "sap/ui/core/Element";
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace ui5.typescript.helloworld.controller
 */
export default class App extends Controller {

	_bExpanded = true;

	public onInit() {
		this.getView().addStyleClass((this.getOwnerComponent() as any).getContentDensityClass());

		// if the app starts on desktop devices with small or meduim screen size, collaps the sid navigation
		if (Device.resize.width <= 1024) {
			this.onSideNavButtonPress();
		}
		Device.media.attachHandler((oDevice: any) => {
			if ((oDevice.name === "Tablet" && this._bExpanded) || oDevice.name === "Desktop") {
				this.onSideNavButtonPress();
				// set the _bExpanded to false on tablet devices
				// extending and collapsing of side navigation should be done when resizing from
				// desktop to tablet screen sizes)
				this._bExpanded = (oDevice.name === "Desktop");
			}
		});
	}

	/**
	 * Convenience method for accessing the router.
	 * @public
	 * @param {sap.ui.base.Event} oEvent The item select event
	 */
	public onItemSelect(oEvent: Event) {
		var oItem = oEvent.getParameter('item');
		var sKey = oItem.getKey();
		// if you click on home, settings or statistics button, call the navTo function
		if ((sKey === "home"
			|| sKey === "masterSettings"
			|| sKey === "statistics"
			|| sKey === "pack"
			|| sKey === "inspectionList")) {
			// if the device is phone, collaps the navigation side of the app to give more space
			if (Device.system.phone) {
				this.onSideNavButtonPress();
			}
			UIComponent.getRouterFor(this).navTo(sKey);
		} else {
			MessageToast.show(sKey);
		}
	}

	public onUserNamePress(oEvent: Event) {
		var oBundle = (this.getView().getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
		// close message popover
		var oMessagePopover = this.byId("errorMessagePopover") as unknown as Popup;
		if (oMessagePopover && oMessagePopover.isOpen()) {
			oMessagePopover.destroy();
		}
		var fnHandleUserMenuItemPress = function (oEvent: Event) {
			MessageToast.show((oEvent.getSource() as any).getText() + " was pressed");
		};
		var oActionSheet = new ActionSheet(this.getView().createId("userMessageActionSheet"), {
			title: oBundle.getText("userHeaderTitle"),
			showCancelButton: false,
			buttons: [
				new Button({ text: 'User Settings', type: ButtonType.Transparent, press: fnHandleUserMenuItemPress }),
				new Button({ text: "Online Guide", type: ButtonType.Transparent, press: fnHandleUserMenuItemPress }),
				new Button({ text: 'Feedback', type: ButtonType.Transparent, press: fnHandleUserMenuItemPress }),
				new Button({ text: 'Help', type: ButtonType.Transparent, press: fnHandleUserMenuItemPress }),
				new Button({ text: 'Logout', type: ButtonType.Transparent, press: fnHandleUserMenuItemPress })
			],
			afterClose: function () {
				oActionSheet.destroy();
			}
		});
		// forward compact/cozy style into dialog
		syncStyleClass((this.getView().getController().getOwnerComponent() as any).getContentDensityClass(), this.getView(), oActionSheet);
		oActionSheet.openBy(oEvent.getSource());
	}

	public onSideNavButtonPress() {
		var oToolPage = this.byId("app") as ToolPage;
		var bSideExpanded = oToolPage.getSideExpanded();
		this._setToggleButtonTooltip(bSideExpanded);
		oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
	}

	_setToggleButtonTooltip(bSideExpanded: boolean) {
		var oToggleButton = this.byId('sideNavigationToggleButton');
		if (bSideExpanded) {
			oToggleButton.setTooltip('Large Size Navigation');
		} else {
			oToggleButton.setTooltip('Small Size Navigation');
		}
	}

	// Errors Pressed
	public onMessagePopoverPress(oEvent: Event) {
		if (!this.byId("errorMessagePopover")) {
			var oMessagePopover = new MessagePopover(this.getView().createId("errorMessagePopover"), {
				placement: VerticalPlacementType.Bottom,
				items: {
					path: 'alerts>/alerts/errors',
					factory: this._createError
				},
				afterClose: function () {
					oMessagePopover.destroy();
				}
			});
			this.byId("app").addDependent(oMessagePopover);
			// forward compact/cozy style into dialog
			syncStyleClass((this.getView().getController().getOwnerComponent() as any).getContentDensityClass(), this.getView(), oMessagePopover);
			oMessagePopover.openBy(oEvent.getSource() as any);
		}
	}

	/**
	 * Event handler for the notification button
	 * @param {sap.ui.base.Event} oEvent the button press event
	 * @public
	 */
	public onNotificationPress(oEvent: Event) {
		var oBundle = (this.getView().getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
		// close message popover
		var oMessagePopover = this.byId("errorMessagePopover") as unknown as Popup;
		if (oMessagePopover && oMessagePopover.isOpen()) {
			oMessagePopover.destroy();
		}
		var oButton = new Button({
			text: oBundle.getText("notificationButtonText"),
			press: function () {
				MessageToast.show("Show all Notifications was pressed");
			}
		});
		var oNotificationPopover = new ResponsivePopover(this.getView().createId("notificationMessagePopover"), {
			title: oBundle.getText("notificationTitle"),
			contentWidth: "300px",
			endButton: oButton,
			placement: PlacementType.Bottom,
			content: {
				path: 'alerts>/alerts/notifications',
				factory: this._createNotification
			},
			afterClose: function () {
				oNotificationPopover.destroy();
			}
		});
		this.byId("app").addDependent(oNotificationPopover);
		// forward compact/cozy style into dialog
		syncStyleClass((this.getView().getController().getOwnerComponent() as any).getContentDensityClass(), this.getView(), oNotificationPopover);
		oNotificationPopover.openBy(oEvent.getSource());
	}

	/**
	 * Factory function for the notification items
	 * @param {string} sId The id for the item
	 * @param {sap.ui.model.Context} oBindingContext The binding context for the item
	 * @returns {sap.m.NotificationListItem} The new notification list item
	 * @private
	 */
	_createNotification(sId: string, oBindingContext: Context): NotificationListItem {
		var oBindingObject = oBindingContext.getObject() as any;
		var oNotificationItem = new NotificationListItem({
			title: oBindingObject['title'],
			description: oBindingObject['description'],
			priority: oBindingObject['priority'],
			close: (oEvent) => {
				var source = oEvent.getSource() as UI5Element;
				var sBindingPath = source.getCustomData()[0].getValue();
				var sIndex = sBindingPath.split("/").pop();
				var sModel = source.getModel("alerts") as JSONModel;
				var aItems = sModel.getProperty("/alerts/notifications");
				aItems.splice(sIndex, 1);
				sModel.setProperty("/alerts/notifications", aItems);
				sModel.updateBindings(true);
				MessageToast.show("Notification has been deleted.");
			},
			datetime: oBindingObject['date'],
			authorPicture: oBindingObject['icon'],
			press: () => {
				var oBundle = (this.getView().getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
				MessageToast.show(oBundle.getText("notificationItemClickedMessage", oBindingObject['title']));
			},
			customData: [
				new CustomData({
					key: "path",
					value: oBindingContext.getPath()
				})
			]
		});
		return oNotificationItem;
	}

	_createError(sId: string, oBindingContext: Context) {
		var oBindingObject = oBindingContext.getObject() as any;
		var oLink = new Link("moreDetailsLink", {
			text: "More Details",
			press: function () {
				MessageToast.show("More Details was pressed");
			}
		});
		var oMessageItem = new MessagePopoverItem({
			title: oBindingObject.title,
			subtitle: oBindingObject.subTitle,
			description: oBindingObject.description,
			counter: oBindingObject.counter,
			link: oLink
		});
		return oMessageItem;
	}
}