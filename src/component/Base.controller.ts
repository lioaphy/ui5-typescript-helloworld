import { ApolloCache, InMemoryCache } from '@apollo/client/cache';
import { ApolloClient, OperationVariables, QueryOptions, ApolloQueryResult, SubscriptionOptions, FetchResult, DefaultContext, MutationOptions, HttpLink, split, gql } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import Controller from 'sap/ui/core/mvc/Controller';
import View from 'sap/ui/core/mvc/View';
import UIComponent from 'sap/ui/core/UIComponent';
import Model from 'sap/ui/model/Model';
import { Observable } from 'subscriptions-transport-ws';
/**
 * @namespace ui5.typescript.helloworld.controller
 */
export default class Base extends Controller {
  // https://www.apollographql.com/docs/react/development-testing/static-typing/
  public client: ApolloClient<any>;
  /* eslint-disable prettier/prettier */
  public $query: <T = any, TVariables = OperationVariables>(options: QueryOptions<TVariables, T>) => Promise<ApolloQueryResult<T>>;
  public $subscribe: <T = any, TVariables = OperationVariables>(options: SubscriptionOptions<TVariables, T>) => Observable<FetchResult<T>>;
  public $mutate: <TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache = ApolloCache<any>>(options: MutationOptions<TData, TVariables, TContext>) => Promise<FetchResult<TData>>;
  /* eslint-enable prettier/prettier */

  // TODO create an apollo options object for UI5
  public apollo: any;

  public getRouter() {
    return UIComponent.getRouterFor(this);
  }

  public onInit(): void {
    // determine the GraphQL datasource
    const dataSources = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources");
    const graphQLServices = Object.keys(dataSources).filter((ds) => {
      return dataSources[ds].type == "GraphQL";
    });

    // the GraphQL service is the first found datasource entry
    const graphQLService = dataSources[graphQLServices.shift()];

    const httpLink = new HttpLink({
      uri: graphQLService.uri,
      credentials: 'same-origin'
    });

    const wsLink = new WebSocketLink({
      uri: graphQLService.settings.ws,
      options: {
        reconnect: true,
      },
    });

    // The split function takes three parameters:
    //
    // * A function that's called for each operation to execute
    // * The Link to use for an operation if the function returns a "truthy" value
    // * The Link to use for an operation if the function returns a "falsy" value
    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === "OperationDefinition" && definition.operation === "subscription";
      },
      wsLink,
      httpLink
    );

    this.client = new ApolloClient({
      name: "ui5-client",
      version: "1.0",
      link: splitLink,
      cache: new InMemoryCache(),
      connectToDevTools: true,
      defaultOptions: {
        watchQuery: { fetchPolicy: "no-cache" },
        query: { fetchPolicy: "no-cache" },
        mutate: { fetchPolicy: "no-cache" },
      },
    });
    this.$query = this.client.query.bind(this.client);
    this.$mutate = this.client.mutate.bind(this.client);
    this.$subscribe = this.client.subscribe.bind(this.client);
  }
  
  /**
   * Convenience method for getting the view model by name.
   * @public
   * @param {string} [sName] the model name
   * @returns {sap.ui.model.Model} the model instance
   */
  public getModel(sName: string): Model {
    return this.getView().getModel(sName);
  }

  /**
   * Convenience method for setting the view model.
   * @public
   * @param {sap.ui.model.Model} oModel the model instance
   * @param {string} sName the model name
   * @returns {sap.ui.mvc.View} the view instance
   */
  public setModel(oModel: Model, sName: string): View {
    return this.getView().setModel(oModel, sName);
  }
}