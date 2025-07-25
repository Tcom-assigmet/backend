// eslint-disable-next-line @typescript-eslint/no-require-imports
const api = require('@novigi/api');
import { CONFIG } from '../config/constants';
import { 
    StartProcessRequest, 
    RequiredField, 
    CamundaClient,
    CamundaResponse,
    CamundaResponseBody,
    CamundaTask,
    CamundaVariable,
    CamundaVariables,
    ProcessVariableInstance,
    HistoricProcessInstance,
    ErrorWithMessage,
    ApiClientFactory
} from '../models/types';
import { AutoLog } from '../utils/logger';

@AutoLog
export class CamundaService {
    private client: CamundaClient;

    constructor() {
        const apiFactory = api as ApiClientFactory;
        this.client = apiFactory(CONFIG.CAMUNDA_BASE_URL);
    }
  
    /**
     * Starts a new Camunda process instance
     */
    async startProcess(request: StartProcessRequest): Promise<string> {
        const path = `/process-definition/key/${CONFIG.PROCESS_DEFINITION_KEY}/start`;

        const variables: CamundaVariables = {
            firstName: { value: request.firstName, type: 'String' },
            lastName: { value: request.lastName, type: 'String' },
            memberId: { value: request.memberId, type: 'String' },
            dateOfBirth: { value: request.dateOfBirth, type: 'Date' },
            dateJoinedFund: { value: request.dateJoinedFund, type: 'Date' },
            effectiveDate: { value: request.effectiveDate, type: 'Date' },
            calculationDate: { value: request.calculationDate, type: 'Date' },
            benefitClass: { value: request.benefitClass, type: 'String' },
            paymentType: { value: request.paymentType, type: 'String' },
            planNumber: { value: request.planNumber, type: 'String' },
            paymentTypeDesc: { value: request.paymentTypeDesc, type: 'String' }
        };

        try {
            const response: CamundaResponse = await this.client
                .header('Content-Type', 'application/json')
                .post(path)
                .body({ variables })
                .response();

            const body: CamundaResponseBody = typeof response.body === 'string' 
                ? JSON.parse(response.body) 
                : response.body as CamundaResponseBody;

            if (body && body.id) {
                return body.id;
            }

            throw new Error('Failed to get process instance ID from response');
        } catch (error: unknown) {
            const errorObj = error as ErrorWithMessage;
            throw new Error(`Failed to start process: ${errorObj.message}`);
        }
    }

    /**
     * Retrieves the task ID for a given process instance
     */
    async getTaskId(processInstanceId: string): Promise<string> {
        const path = `/task?processInstanceId=${processInstanceId}`;

        try {
            const response: CamundaResponse = await this.client
                .get(path)
                .response();

            const body = typeof response.body === 'string' 
                ? JSON.parse(response.body) 
                : response.body;

            if (Array.isArray(body) && body.length > 0) {
                const tasks = body as CamundaTask[];
                return tasks[0].id;
            }

            throw new Error(`No tasks found for process instance: ${processInstanceId}`);
        } catch (error: unknown) {
            const errorObj = error as ErrorWithMessage;
            throw new Error(`Failed to get task ID: ${errorObj.message}`);
        }
    }

    /**
     * Gets required fields for a task from form variables
     */
    async getRequiredFields(taskId: string, processInstanceId: string): Promise<RequiredField[]> {
        const path = `/task/${taskId}/form-variables`;

        try {
            const response: CamundaResponse = await this.client
                .get(path)
                .response();

            const body = typeof response.body === 'string' 
                ? JSON.parse(response.body) 
                : response.body;

            if (body && typeof body === 'object' && 'requiredFields' in body) {
                const formBody = body as { requiredFields?: { value?: string } };
                if (formBody.requiredFields?.value) {
                    return JSON.parse(formBody.requiredFields.value) as RequiredField[];
                }
            }
        } catch (error: unknown) {
            const errorObj = error as ErrorWithMessage;
            throw new Error(`Failed to get required fields for process ${processInstanceId} : ${errorObj.message}`);
        }

        return [];
    }

    /**
     * Completes a task with provided variables
     */
    async completeTaskWithVariables(taskId: string, variables: Record<string, unknown>): Promise<void> {
        const path = `/task/${taskId}/complete`;

        const camundaVariables: CamundaVariables = {};

        // Convert variables to Camunda format with type inference
        for (const [key, value] of Object.entries(variables)) {
            if (typeof value === 'object' && value !== null && 'value' in value && 'type' in value) {
                camundaVariables[key] = value as CamundaVariable;
                continue;
            }

            let type: CamundaVariable['type'] = 'String';
            if (typeof value === 'number') type = 'Double';
            else if (typeof value === 'boolean') type = 'Boolean';
            else if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}.*/.test(value)) type = 'Date';

            camundaVariables[key] = { value: value as string | number | boolean | Date, type };
        }

        try {
            await this.client
                .header('Content-Type', 'application/json')
                .post(path)
                .body({ variables: camundaVariables })
                .response();
        } catch (error: unknown) {
            const errorObj = error as ErrorWithMessage;
            throw new Error(`Failed to complete task: ${errorObj.message}`);
        }
    }

    /**
     * Completes a task with raw request body
     */
    async completeTaskDirect(taskId: string, requestBody: Record<string, unknown>): Promise<void> {
        const path = `/task/${taskId}/complete`;

        try {
            await this.client
                .header('Content-Type', 'application/json')
                .post(path)
                .body(requestBody)
                .response();
        } catch (error: unknown) {
            const errorObj = error as ErrorWithMessage;
            throw new Error(`Failed to complete task: ${errorObj.message}`);
        }
    }

    /**
     * Retrieves all variables for a process instance
     */
    async getProcessVariables(processInstanceId: string): Promise<Record<string, string>> {
        const path = `/variable-instance?processInstanceIdIn=${processInstanceId}`;

        try {
            const response: CamundaResponse = await this.client
                .get(path)
                .response();

            const body = typeof response.body === 'string' 
                ? JSON.parse(response.body) 
                : response.body;

            const variables: Record<string, string> = {};
            
            if (Array.isArray(body)) {
                const variableInstances = body as ProcessVariableInstance[];
                for (const variable of variableInstances) {
                    const name = variable.name;
                    // Stringify objects, keep primitives as-is
                    const value = typeof variable.value === 'object' && variable.value !== null
                        ? JSON.stringify(variable.value)
                        : variable.value as string ;

                    variables[name] = value;
                }
            }

            return variables;
        } catch (error: unknown) {
            const errorObj = error as ErrorWithMessage;
            throw new Error(`Failed to get process variables: ${errorObj.message}`);
        }
    }

    /**
     * Gets subprocess instance ID for a given super process
     */
    async getSubProcessInstanceId(superProcessInstanceId: string): Promise<string | null> {
        const path = `/process-instance?superProcessInstance=${superProcessInstanceId}`;

        try {
            const response: CamundaResponse = await this.client
                .get(path)
                .response();

            const body = typeof response.body === 'string' 
                ? JSON.parse(response.body) 
                : response.body;

            if (Array.isArray(body) && body.length > 0) {
                const processes = body as { id: string }[];
                return processes[0].id;
            }

            return null;
        } catch (error: unknown) {
            const errorObj = error as ErrorWithMessage;
            console.error(`Failed to get subprocess instance ID: ${errorObj.message}`);
            return null;
        }
    }

    /**
     * Checks if a process instance has completed
     */
    async isProcessCompleted(processInstanceId: string): Promise<boolean> {
        const path = `/process-instance/${processInstanceId}`;

        try {
            const response: CamundaResponse = await this.client
                .get(path)
                .response();
            
            const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;

            // If we get a 404, the process is not active anymore
            if (response.statusCode === 404 || !body) {
                return true;
            }

            // If we get a valid response, check if it has an end time
            const processInstance = body as HistoricProcessInstance;
            return processInstance.endTime !== null;
        } catch (error: unknown) {
            const errorObj = error as ErrorWithMessage;
            // 404 means process is completed (no longer active)
            if (errorObj.message.includes('404') || errorObj.message.includes('Not Found')) {
                return true;
            }
            
            return await this.checkProcessInHistory(processInstanceId);
        }
    }

    /**
     * Checks process completion status in history
     */
    private async checkProcessInHistory(processInstanceId: string): Promise<boolean> {
        const path = `/history/process-instance/${processInstanceId}`;

        try {
            const response: CamundaResponse = await this.client
                .get(path)
                .response();

            const body = typeof response.body === 'string' 
                ? JSON.parse(response.body) 
                : response.body;

            const historicProcess = body as HistoricProcessInstance;
            // Process is completed if it has an end time
            return historicProcess && historicProcess.endTime !== null;
        } catch (error: unknown) {
            const errorObj = error as ErrorWithMessage;
            return errorObj.message.includes('404') || errorObj.message.includes('Not Found');
        }
    }
}