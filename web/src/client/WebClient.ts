import Configuration from '../config/Config';
import GraphData from '../types/graphic/GraphData';
import Pathway from '../types/Pathway';
import DiseaseMap from '../types/DiseaseMap';
import Node from '../types/graphic/Node';
import Circuit from '../types/Circuit';
import PathwayCircuit from '../types/PathwayCircuit';

function normalizeApiUrl(url: string) {
  return url.endsWith('/') ? url : `${url}/`;
}
const API_ENDPOINT = normalizeApiUrl(Configuration.API_ENDPOINT);

/* eslint-disable @typescript-eslint/no-explicit-any */
class WebClient {
  /***** DISEASE MAP ****/

  static translateFromServerDiseaseMap(diseasesMap: any): DiseaseMap {
    return {
      id: diseasesMap.id,
      name: diseasesMap.name,
      description: diseasesMap.description,
      circuits:
        diseasesMap.circuits && typeof diseasesMap.circuits === 'object'
          ? Object.entries(diseasesMap.circuits).reduce(
              (acc: any, [key, circuitData]: [string, any]) => {
                acc[key] = {
                  circuit: Array.isArray(circuitData.circuit)
                    ? [...circuitData.circuit]
                    : [],
                  subpathways: WebClient.translateFromServerGraphData(
                    circuitData.subpathways,
                  ),
                };
                return acc;
              },
              {},
            )
          : null,
    };
  }

  static translateFromServePathwayCircuit(pathwayCircuit: any): PathwayCircuit {
    return {
      pathway_id: pathwayCircuit.id,
      p_patwhays: Array.isArray(pathwayCircuit.p_pathways)
        ? pathwayCircuit.p_pathways.map((c: any) =>
            this.translateFromServerCircuit(c),
          )
        : null,
      subpathways: WebClient.translateFromServerGraphData(
        pathwayCircuit.subpathways,
      ),
    };
  }

  static translateFromServerCircuit(circuit: any): Circuit {
    return {
      id: circuit.properties.id,
    };
  }

  public static async getDiseaseMaps(
    abortSignal: AbortSignal,
  ): Promise<DiseaseMap[]> {
    const params = {};
    const url = `diseases-maps`;
    const response = await WebClient.get<any>(url, params, abortSignal);
    if (!('diseases_maps' in response)) {
      const error = new Error('Unrecognized response');
      error.name = '500';
      throw error;
    } else {
      return response.diseases_maps.map((diseasesMap: any) =>
        WebClient.translateFromServerDiseaseMap(diseasesMap),
      );
    }
  }

  public static async getDiseaseMapGraphData(
    diseaseMapId: string,
    abortSignal: AbortSignal,
  ): Promise<DiseaseMap> {
    const params = {};
    //const userParam = encodeURIComponent(userId);
    console.log(diseaseMapId);
    const url = `diseases-maps/${diseaseMapId}`;
    const response = await WebClient.get<any>(url, params, abortSignal);
    if (!response) {
      const error = new Error('Unrecognized response');
      error.name = '500';
      throw error;
    } else {
      return WebClient.translateFromServerDiseaseMap(response);
    }
  }

  /***** COMMON GRAPH ****/

  static translateFromServerGraphData(graphData: any): GraphData {
    const result: GraphData = {
      nodes: graphData.nodes ? [...graphData.nodes] : [],
      links: graphData.links ? [...graphData.links] : [],
    };

    return result;
  }

  static translateFromServerNode(node: any): Node {
    return { ...node };
  }

  /***** PATHWAY ****/

  static translateFromServerPathway(pathway: any): Pathway {
    return {
      id: pathway.id,
      name: pathway.name,
      description: pathway.description,
    };
  }

  public static async getPathways(
    abortSignal: AbortSignal,
  ): Promise<Pathway[]> {
    const params = {};
    const url = `pathways`;
    const response = await WebClient.get<any>(url, params, abortSignal);
    if (!('pathways' in response)) {
      const error = new Error('Unrecognized response');
      error.name = '500';
      throw error;
    } else {
      return response.pathways.map((pathway: any) =>
        WebClient.translateFromServerPathway(pathway),
      );
    }
  }

  public static async getGraphData(
    pathwayId: string,
    abortSignal: AbortSignal,
  ): Promise<GraphData> {
    const params = {};
    //const userParam = encodeURIComponent(userId);
    console.log(pathwayId);
    const url = `pathways/N-${pathwayId}-`;
    const response = await WebClient.get<any>(url, params, abortSignal);
    if (!response) {
      const error = new Error('Unrecognized response');
      error.name = '500';
      throw error;
    } else {
      return WebClient.translateFromServerGraphData(response);
    }
  }

  public static async getEffectorGenes(
    pathwayId: string,
    abortSignal: AbortSignal,
  ): Promise<Node[]> {
    const params = {};
    const url = `pathways/effectorGenes/N-${pathwayId}-/list`;
    const response = await WebClient.get<any>(url, params, abortSignal);
    if (!('nodes' in response)) {
      const error = new Error('Unrecognized response');
      error.name = '500';
      throw error;
    } else {
      return response.nodes.map((node: any) =>
        WebClient.translateFromServerNode(node),
      );
    }
  }

  static async getPathwayEffectorGene(
    effectorGeneId: string,
    abortSignal: AbortSignal,
  ): Promise<Node[]> {
    const params = {};
    const url = `pathways/effectorGenes/effectorGeneId/${effectorGeneId}`;
    const response = await WebClient.get<any>(url, params, abortSignal);

    if (!('nodes' in response)) {
      const error = new Error('Unrecognized response');
      error.name = '500';
      throw error;
    } else {
      return response.nodes.map((node: any) =>
        WebClient.translateFromServerNode(node),
      );
    }
  }

  public static async getIniEffectorGenes(
    pathwayId: string,
    effectorGeneId: string,
    abortSignal: AbortSignal,
  ): Promise<Node[]> {
    const params = {};
    const url = `pathways/iniEffectorGenes/effectorGeneId/${effectorGeneId}/list`;
    const response = await WebClient.get<any>(url, params, abortSignal);
    if (!('nodes' in response)) {
      const error = new Error('Unrecognized response');
      error.name = '500';
      throw error;
    } else {
      return response.nodes.map((node: any) =>
        WebClient.translateFromServerNode(node),
      );
    }
  }

  static async getPathwayIniEffectorGene(
    iniEffectorGeneId: string,
    effectorGeneId: string,
    abortSignal: AbortSignal,
  ): Promise<Node[]> {
    const params = {};
    const url = `pathways/effectorGenes/iniEffectorGeneId/${iniEffectorGeneId}/effectorGeneId/${effectorGeneId}`;
    const response = await WebClient.get<any>(url, params, abortSignal);

    if (!('nodes' in response)) {
      const error = new Error('Unrecognized response');
      error.name = '500';
      throw error;
    } else {
      return response.nodes.map((node: any) =>
        WebClient.translateFromServerNode(node),
      );
    }
  }

  static async getNodeDetail(
    selectedNode: string,
    abortSignal: AbortSignal,
  ): Promise<Node[]> {
    const params = {};
    const url = `pathways/nodes/detail/${selectedNode}`;
    const response = await WebClient.get<any>(url, params, abortSignal);

    if (!('nodes' in response)) {
      const error = new Error('Unrecognized response');
      error.name = '500';
      throw error;
    } else {
      return response.nodes.map((node: any) =>
        WebClient.translateFromServerNode(node),
      );
    }
  }

  /***** COMMON GENERIC ****/

  private static async exchange<T>(
    serviceUrl: string,
    httpMethod: string,
    queryParams: any,
    requestBody: any,
    abortSignal: AbortSignal,
  ): Promise<T> {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    } as any;
    const params = {
      method: httpMethod,
      mode: 'cors',
      headers: headers,
      signal: abortSignal,
      body: undefined === requestBody ? undefined : JSON.stringify(requestBody),
    } as RequestInit;
    const queryStr =
      undefined === queryParams
        ? ''
        : Object.entries(queryParams)
            .filter(([paramValue]) => undefined !== paramValue)
            .map(([paramName, paramValue]) => {
              const value: string =
                paramValue instanceof Date
                  ? paramValue.toISOString()
                  : (paramValue as string);
              return `${encodeURIComponent(paramName)}=${encodeURIComponent(value)}`;
            })
            .join('&');
    const queryUrl = `${API_ENDPOINT}${serviceUrl}${queryStr ? '?' : ''}${queryStr}`;
    const response = await fetch(queryUrl, params);
    if (response.ok) {
      const actualResponse = await response.json();
      return actualResponse;
    } else {
      const error = new Error(response.statusText);
      error.name = `${response.status}`;
      throw error;
    }
  }

  private static async get<T>(
    serviceUrl: string,
    queryParams: any,
    abortSignal: AbortSignal,
  ): Promise<T> {
    return WebClient.exchange(
      serviceUrl,
      'GET',
      queryParams,
      undefined,
      abortSignal,
    );
  }

  private static async put<T>(
    serviceUrl: string,
    queryParams: any,
    requestBody: any,
    abortSignal: AbortSignal,
  ): Promise<T> {
    return WebClient.exchange(
      serviceUrl,
      'PUT',
      queryParams,
      requestBody,
      abortSignal,
    );
  }

  private static async post<T>(
    serviceUrl: string,
    queryParams: any,
    requestBody: any,
    abortSignal: AbortSignal,
  ): Promise<T> {
    return WebClient.exchange(
      serviceUrl,
      'POST',
      queryParams,
      requestBody,
      abortSignal,
    );
  }

  private static async delete<T>(
    serviceUrl: string,
    queryParams: any,
    abortSignal: AbortSignal,
  ): Promise<T> {
    return WebClient.exchange(
      serviceUrl,
      'DELETE',
      queryParams,
      undefined,
      abortSignal,
    );
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default WebClient;
