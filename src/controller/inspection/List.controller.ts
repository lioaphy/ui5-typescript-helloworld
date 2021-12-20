import { ApolloClient, gql, HttpLink, InMemoryCache, split } from "@apollo/client/core";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import Controller from "sap/ui/core/mvc/Controller";
import BindingMode from "sap/ui/model/BindingMode";
import JSONModel from "sap/ui/model/json/JSONModel";
// @ts-ignore
import BindingParser from "sap/ui/base/BindingParser";

const GET_SIP = gql`
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
`;

/**
 * @namespace ui5.typescript.helloworld.controller.inspection
 */
export default class List extends Controller {

  public client: ApolloClient<any>;
  public apollo: any;

  public onInit(): void {
    // determine the GraphQL datasource
    const dataSources = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources");
    const graphQLServices = Object.keys(dataSources).filter((ds) => {
      return dataSources[ds].type == "GraphQL";
    });

    // the GraphQL service is the first found datasource entry
    const graphQLService = dataSources[graphQLServices.shift()];
    console.log(graphQLService)

    const httpLink = new HttpLink({
      uri: graphQLService.uri,
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

    const model = new JSONModel();
    model.setDefaultBindingMode(BindingMode.OneWay);
    this.getView().setModel(model);

    this.client.query({ query: GET_SIP }).then((result) => {
      console.log(result);

      const binding = BindingParser.complexParser("{/sip}");
      if (binding) {
        const modelName = binding.model;
        const path = binding.path || `/sip`; // defaults to entity
        const value = result.data?.InspectSIPPagination?.items || [];
        const model = this.getView().getModel(modelName) as JSONModel;
        model.setProperty(path, value);
      }
    })

  }

}