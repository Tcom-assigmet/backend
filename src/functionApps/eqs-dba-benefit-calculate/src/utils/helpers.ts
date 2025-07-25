<<<<<<< HEAD
import { HttpRequest, HttpResponseInit } from "@azure/functions";
import {  FinalResultResponse, ProcessResponse, RequiredField , ApiResponse, ApiError, ValidationError } from "../models/types";

// Type for error response body
interface ErrorResponseBody {
    error: string;
}

// Generic type for success response data
=======
import { HttpResponseInit } from "@azure/functions";
import { ResponseData } from '../models/types';
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c


export const createErrorResponse = (status: number, message: string): HttpResponseInit => ({
    status,
    jsonBody: { error: message } as ErrorResponseBody
});

<<<<<<< HEAD
export const createSuccessResponse = (data: FinalResultResponse): HttpResponseInit => ({
    status: 200,
    jsonBody: data
});

export const createSuccessResponseStartCal = (data:ProcessResponse ): HttpResponseInit => ({
    status: 200,
    jsonBody: data
});

export const createSuccessResponseTaskDetails = (data:{ taskId: string; requiredFields: RequiredField[] }): HttpResponseInit => ({
=======
export const createSuccessResponse = (data: ResponseData): HttpResponseInit => ({
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
    status: 200,
    jsonBody: data
});

export const createSuccessMessageResponse = (message: string): HttpResponseInit => ({
    status: 200,
    body: message
});


export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  PROCESS_START_FAILED = 'PROCESS_START_FAILED',
  TASK_COMPLETION_FAILED = 'TASK_COMPLETION_FAILED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  INVALID_REQUEST = 'INVALID_REQUEST',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}

class ResponseBuilder {
  private createBaseResponse<T>(
    request: HttpRequest,
    success: boolean,
    data?: T,
    error?: ApiError
  ): ApiResponse<T> {
    return {
      success,
      data,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method || 'UNKNOWN'
    };
  }

  success<T>(
    request: HttpRequest,
    data: T,
    statusCode: HttpStatusCode = HttpStatusCode.OK
  ): HttpResponseInit {
    return {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      },
      jsonBody: this.createBaseResponse(request, true, data)
    };
  }

  created<T>(request: HttpRequest, data: T): HttpResponseInit {
    return this.success(request, data, HttpStatusCode.CREATED);
  }

  noContent(request: HttpRequest): HttpResponseInit {
    return {
      status: HttpStatusCode.NO_CONTENT,
      headers: {
        'Content-Type': 'application/json'
      },
      jsonBody: this.createBaseResponse(request, true)
    };
  }

  error(
    request: HttpRequest,
    statusCode: HttpStatusCode,
    errorCode: ErrorCode,
    message: string,
    details?: string,
    validationErrors?: ValidationError[]
  ): HttpResponseInit {
    const error: ApiError = {
      code: errorCode,
      message,
      details,
      validationErrors
    };

    return {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      },
      jsonBody: this.createBaseResponse(request, false, undefined, error)
    };
  }

  badRequest(
    request: HttpRequest,
    message: string = 'Bad Request',
    validationErrors?: ValidationError[]
  ): HttpResponseInit {
    return this.error(
      request,
      HttpStatusCode.BAD_REQUEST,
      ErrorCode.VALIDATION_ERROR,
      message,
      undefined,
      validationErrors
    );
  }

  notFound(
    request: HttpRequest,
    message: string = 'Resource not found'
  ): HttpResponseInit {
    return this.error(
      request,
      HttpStatusCode.NOT_FOUND,
      ErrorCode.NOT_FOUND,
      message
    );
  }

  internalServerError(
    request: HttpRequest,
    message: string = 'Internal server error',
    details?: string
  ): HttpResponseInit {
    return this.error(
      request,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_ERROR,
      message,
      details
    );
  }

  serviceUnavailable(
    request: HttpRequest,
    message: string = 'Service temporarily unavailable'
  ): HttpResponseInit {
    return this.error(
      request,
      HttpStatusCode.SERVICE_UNAVAILABLE,
      ErrorCode.SERVICE_UNAVAILABLE,
      message
    );
  }
}

export const responseBuilder = new ResponseBuilder();