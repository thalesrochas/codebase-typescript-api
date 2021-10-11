/* eslint-disable @typescript-eslint/no-empty-interface */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export interface RequestConfig extends AxiosRequestConfig {}

export interface Response<T = unknown> extends AxiosResponse<T> {}

export interface RequestError extends AxiosError {}

export default class Request {
  constructor(private request = axios) {}

  public get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> {
    return this.request.get<T, Response<T>>(url, config);
  }

  public post<T>(
    url: string,
    data: unknown = {},
    config: RequestConfig = {}
  ): Promise<Response<T>> {
    return this.request.post<T, Response<T>>(url, data, config);
  }

  public static isRequestError(error: RequestError): boolean {
    return !!(error.response && error.response.status);
  }
}
